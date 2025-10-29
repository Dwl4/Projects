import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityService } from '../api';

const CommunityPage = ({ onPostClick, onWriteClick }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [showMyPosts, setShowMyPosts] = useState(false); // 내가 쓴 글 보기 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const limit = 10; // 페이지당 게시글 수

  // 로그인 상태 확인
  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = localStorage.getItem('currentUser');
    const isLawyer = localStorage.getItem('isLawyer') === 'true';

    // 일반 사용자만 커뮤니티 이용 가능 (변호사 제외)
    setIsLoggedIn(loginStatus && currentUser && !isLawyer);
  }, []);

  // 게시글 목록 조회
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (showMyPosts) {
        // 내가 쓴 글 조회 (로그인 필요)
        const params = {
          page: currentPage,
          limit: limit,
        };
        response = await communityService.getMyPosts(params);
        console.log('📋 내가 쓴 글 응답:', response);
      } else {
        // 전체 게시글 조회
        const params = {
          page: currentPage,
          limit: limit,
        };

        // 전체가 아닌 경우 카테고리 필터 추가
        if (selectedCategory !== '전체') {
          params.category = selectedCategory;
        }

        response = await communityService.getPosts(params);
        console.log('📋 게시글 목록 응답:', response);
      }

      // API 응답 구조: { total, page, limit, items }
      setPosts(response.items || []);

      // 총 페이지 수 계산
      const total = response.total || 0;
      const calculatedPages = Math.ceil(total / limit);
      setTotalPages(calculatedPages || 1);
    } catch (err) {
      console.error('게시글 목록 조회 실패:', err);
      setError('게시글을 불러오는데 실패했습니다.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리, 페이지, 내 글 보기 상태 변경 시 게시글 조회
  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, currentPage, showMyPosts]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowMyPosts(false); // 카테고리 변경 시 내 글 보기 해제
  };

  // 내가 쓴 글 토글
  const handleToggleMyPosts = () => {
    setShowMyPosts(!showMyPosts);
    setCurrentPage(1);
    if (!showMyPosts) {
      setSelectedCategory('전체'); // 내 글 보기 시 카테고리 필터 초기화
    }
  };

  // 글쓰기 버튼 클릭
  const handleWriteClick = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    if (onWriteClick) {
      onWriteClick();
    }
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (post) => {
    navigate(`/community/post/${post.id}`);
  };

  // 게시글 삭제 핸들러
  const handleDeletePost = async (e, postId) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지

    if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      console.log('🗑️ 게시글 삭제 요청:', postId);
      await communityService.deletePost(postId);
      console.log('✅ 게시글 삭제 완료');

      alert('게시글이 삭제되었습니다.');

      // 목록 새로고침
      fetchPosts();
    } catch (err) {
      console.error('❌ 게시글 삭제 실패:', err);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full bg-white mx-auto">
      {/* Main Community Content */}
      <div className="px-[0px] py-[0px]">
        {/* Community Title */}
        <div className="h-[100px] flex items-center justify-center relative">
          <h1 className="text-[30px] font-bold text-black">LM 커뮤니티</h1>

          {/* 로그인한 사용자 버튼들 */}
          {isLoggedIn && (
            <div className="absolute right-[50px] flex items-center gap-[10px]">
              <button
                onClick={handleToggleMyPosts}
                className={`px-[20px] py-[8px] rounded-[8px] text-[14px] font-medium transition-all ${
                  showMyPosts
                    ? 'bg-[#9ec3e5] text-white shadow-md'
                    : 'bg-white border-2 border-[#9ec3e5] text-[#9ec3e5] hover:bg-[#f0f8ff]'
                }`}
              >
                {showMyPosts ? '전체 글 보기' : '내가 쓴 글'}
              </button>
              <button
                onClick={handleWriteClick}
                className="px-[20px] py-[8px] bg-[#9ec3e5] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#7da9d3] active:bg-[#6b98c2] shadow-md transition-all"
              >
                글쓰기
              </button>
            </div>
          )}
        </div>

        {/* Category Filter - 내가 쓴 글 모드에서는 숨김 */}
        {!showMyPosts && (
          <div className="h-[20px] flex items-center justify-end gap-[30px] px-[50px] text-[13px] mb-[10px]">
            <button
              onClick={() => handleCategoryChange('전체')}
              className={`${selectedCategory === '전체' ? 'font-bold underline' : 'font-normal'} hover:font-bold transition-all`}
            >
              전체
            </button>
            <button
              onClick={() => handleCategoryChange('고민/상담')}
              className={`${selectedCategory === '고민/상담' ? 'font-bold underline' : 'font-normal'} hover:font-bold transition-all`}
            >
              고민/상담
            </button>
            <button
              onClick={() => handleCategoryChange('잡담')}
              className={`${selectedCategory === '잡담' ? 'font-bold underline' : 'font-normal'} hover:font-bold transition-all`}
            >
              잡담
            </button>
            <button
              onClick={() => handleCategoryChange('후기')}
              className={`${selectedCategory === '후기' ? 'font-bold underline' : 'font-normal'} hover:font-bold transition-all`}
            >
              후기
            </button>
          </div>
        )}

        {/* 내가 쓴 글 모드 표시 */}
        {showMyPosts && (
          <div className="h-[20px] flex items-center justify-center text-[13px] mb-[10px]">
            <p className="text-[#9ec3e5] font-bold">📝 내가 작성한 글 목록</p>
          </div>
        )}

        {/* Community Table */}
        <div className="px-[20px]">
          {/* Table Header */}
          <div className="w-full border-t-[2px] border-b-[2px] border-[#9ec3e5] bg-white flex">
            <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-[#08213b]">번호</div>
            <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-[#08213b]">카테고리</div>
            <div className={`${showMyPosts ? 'w-[460px]' : 'w-[560px]'} h-[30px] flex items-center p-[10px] text-[13px] text-[#08213b]`}>제목</div>
            <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-[#08213b]">날짜</div>
            <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-[#08213b]">조회</div>
            {showMyPosts && (
              <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-[#08213b]">관리</div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="w-full h-[300px] flex items-center justify-center">
              <p className="text-[14px] text-gray-500">로딩 중...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="w-full h-[300px] flex items-center justify-center">
              <p className="text-[14px] text-red-500">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <div className="w-full h-[300px] flex items-center justify-center">
              <p className="text-[14px] text-gray-500">게시글이 없습니다.</p>
            </div>
          )}

          {/* Table Rows */}
          {!loading && !error && posts.length > 0 && posts.map((post, index) => {
            // 내림차순 번호 계산 (전체 개수 - 현재 인덱스)
            const displayNumber = posts.length - index;

            return (
            <div
              key={post.id}
              className="w-full bg-white flex hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handlePostClick(post)}
            >
              <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-black">
                {displayNumber}
              </div>
              <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-black">
                {post.category || '-'}
              </div>
              <div className={`${showMyPosts ? 'w-[460px]' : 'w-[560px]'} h-[30px] flex items-center p-[10px] text-[13px] text-black`}>
                <span className={post.title?.includes('[공지]') ? 'text-red-500' : 'text-black'}>
                  {post.title}
                </span>
                {post.comments && post.comments.length > 0 && (
                  <span className="text-red-500 text-[9px] font-medium ml-[4px]">[{post.comments.length}]</span>
                )}
              </div>
              <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-black">
                {new Date(post.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).replace(/\. /g, '.').replace(/\.$/, '')}
              </div>
              <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-black">
                {post.views || 0}
              </div>
              {showMyPosts && (
                <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px]">
                  <button
                    onClick={(e) => handleDeletePost(e, post.id)}
                    className="px-[10px] py-[3px] bg-red-500 text-white text-[11px] rounded-[4px] hover:bg-red-600 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
            );
          })}
        </div>

        {/* Pagination */}
        {!loading && !error && posts.length > 0 && (
          <div className="h-[207px] flex items-center justify-center">
            <div className="flex items-center gap-[20px]">
              {/* Previous Button */}
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="bg-[#d9d9d9] px-[10px] py-[5px] rounded-[5px] text-[12px] font-medium text-black hover:bg-gray-400 transition-colors"
                >
                  이전
                </button>
              )}

              {/* Page Numbers */}
              <div className="flex items-center gap-[10px] text-[10px] font-bold text-black">
                {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${currentPage === page ? 'underline' : ''} hover:underline transition-all px-[5px]`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="bg-[#d9d9d9] px-[10px] py-[5px] rounded-[5px] text-[12px] font-medium text-black hover:bg-gray-400 transition-colors"
                >
                  다음
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
