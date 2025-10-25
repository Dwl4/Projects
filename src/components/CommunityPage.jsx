import React, { useState, useEffect } from 'react';
import { communityService } from '../api';

const CommunityPage = ({ onPostClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // 페이지당 게시글 수

  // 게시글 목록 조회
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: limit,
      };

      // 전체가 아닌 경우 카테고리 필터 추가
      if (selectedCategory !== '전체') {
        params.category = selectedCategory;
      }

      const response = await communityService.getPosts(params);
      setPosts(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      console.error('게시글 목록 조회 실패:', err);
      setError('게시글을 불러오는데 실패했습니다.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 또는 페이지 변경 시 게시글 조회
  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, currentPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (post) => {
    if (onPostClick) {
      onPostClick(post);
    }
  };

  return (
    <div className="w-full bg-white mx-auto">
      {/* Main Community Content */}
      <div className="px-[0px] py-[0px]">
        {/* Community Title */}
        <div className="h-[100px] flex items-center justify-center">
          <h1 className="text-[30px] font-bold text-black">LM 커뮤니티</h1>
        </div>

        {/* Category Filter */}
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

        {/* Community Table */}
        <div className="px-[20px]">
          {/* Table Header */}
          <div className="w-full border-t-[2px] border-b-[2px] border-[#9ec3e5] bg-white flex">
            <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-[#08213b]">번호</div>
            <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-[#08213b]">카테고리</div>
            <div className="w-[560px] h-[30px] flex items-center p-[10px] text-[13px] text-[#08213b]">제목</div>
            <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-[#08213b]">날짜</div>
            <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-[#08213b]">조회</div>
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
          {!loading && !error && posts.length > 0 && posts.map((post) => (
            <div
              key={post.id}
              className="w-full bg-white flex hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handlePostClick(post)}
            >
              <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-black">
                {post.id}
              </div>
              <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-black">
                {post.category}
              </div>
              <div className="w-[560px] h-[30px] flex items-center p-[10px] text-[13px] text-black">
                <span className={post.isNotice && post.title?.includes('[공지]') ? 'text-red-500' : 'text-black'}>
                  {post.title}
                </span>
                {post.commentCount > 0 && (
                  <span className="text-red-500 text-[9px] font-medium ml-[4px]">[{post.commentCount}]</span>
                )}
              </div>
              <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-black">
                {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).replace(/\. /g, '.').replace(/\.$/, '')}
              </div>
              <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-black">
                {post.views || 0}
              </div>
            </div>
          ))}
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
