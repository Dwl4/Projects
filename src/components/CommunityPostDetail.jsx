import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as communityService from '../api/communityService';

// 기본 프로필 아이콘 SVG 컴포넌트
const DefaultProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-gray-400">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

// 프로필 이미지 URL 처리 함수
const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // 이미 전체 URL인 경우
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // 상대 경로인 경우 서버 URL 추가
  const serverUrl = process.env.REACT_APP_API_BASE_URL || 'http://54.180.238.189:8001';
  const baseUrl = serverUrl.replace('/api/v1', ''); // API 경로 제거

  // 경로가 /로 시작하지 않으면 추가
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${baseUrl}${path}`;
};

const CommunityPostDetail = () => {
  const { id } = useParams(); // URL에서 게시글 ID 가져오기
  const navigate = useNavigate();

  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAllComments, setShowAllComments] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 댓글 수정 관련 state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const [relatedPosts, setRelatedPosts] = useState([]); // 관련 게시글
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
  const postsPerPage = 10; // 페이지당 게시글 수

  // 게시글 상세 정보 및 댓글 조회
  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        console.log('📋 게시글 상세 조회:', id);
        const response = await communityService.getPostDetail(id);
        console.log('✅ 게시글 상세 응답:', response);

        setPostData(response);
        setComments(response.comments || []);
      } catch (err) {
        console.error('❌ 게시글 조회 실패:', err);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [id]);

  // 관련 게시글 목록 조회
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await communityService.getPosts({
          page: currentPage,
          limit: postsPerPage,
          category: selectedCategory === '전체' ? undefined : selectedCategory
        });
        setRelatedPosts(response.items || []);

        // 총 페이지 수 계산
        const total = response.total || 0;
        const calculatedPages = Math.ceil(total / postsPerPage);
        setTotalPages(calculatedPages || 1);
      } catch (err) {
        console.error('❌ 관련 게시글 조회 실패:', err);
      }
    };

    fetchRelatedPosts();
  }, [selectedCategory, currentPage, postsPerPage]);

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    // 로그인 체크
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    try {
      console.log('📝 댓글 작성:', { postId: id, content: newComment });
      await communityService.createComment(id, newComment.trim());
      console.log('✅ 댓글 작성 완료');

      // 댓글 목록 새로고침
      const response = await communityService.getPostDetail(id);
      setComments(response.comments || []);
      setNewComment('');
      alert('댓글이 작성되었습니다.');
    } catch (err) {
      console.error('❌ 댓글 작성 실패:', err);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      console.log('🗑️ 댓글 삭제:', commentId);
      await communityService.deleteComment(commentId);
      console.log('✅ 댓글 삭제 완료');

      // 댓글 목록 새로고침
      const response = await communityService.getPostDetail(id);
      setComments(response.comments || []);
      alert('댓글이 삭제되었습니다.');
    } catch (err) {
      console.error('❌ 댓글 삭제 실패:', err);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 댓글 수정 시작
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  // 댓글 수정 저장
  const handleSaveEdit = async (commentId) => {
    if (!editingContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      console.log('✏️ 댓글 수정:', { commentId, content: editingContent });
      await communityService.updateComment(commentId, editingContent.trim());
      console.log('✅ 댓글 수정 완료');

      // 댓글 목록 새로고침
      const response = await communityService.getPostDetail(id);
      setComments(response.comments || []);
      setEditingCommentId(null);
      setEditingContent('');
      alert('댓글이 수정되었습니다.');
    } catch (err) {
      console.error('❌ 댓글 수정 실패:', err);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 페이지 번호 목록 생성 (최대 9개)
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 9;

    if (totalPages <= maxPagesToShow) {
      // 전체 페이지가 9개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지를 중심으로 9개 표시
      const halfRange = Math.floor(maxPagesToShow / 2);
      let startPage = Math.max(1, currentPage - halfRange);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      // 끝에 가까우면 시작 페이지 조정
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const handleShowMoreComments = () => {
    setShowAllComments(true);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로
  };

  // 선택된 카테고리에 따라 게시글 필터링
  const filteredPosts = selectedCategory === '전체'
    ? relatedPosts
    : relatedPosts.filter(post => post.category === selectedCategory);

  // 표시할 댓글 필터링
  const displayedComments = showAllComments ? comments : comments.slice(0, 5);

  // 댓글 렌더링 함수
  const renderComment = (comment) => {
    const formattedDate = comment.created_at
      ? new Date(comment.created_at).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '')
      : '-';

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUserId = localStorage.getItem('user_id');
    const isMyComment = isLoggedIn && currentUserId && String(comment.user_id) === String(currentUserId);

    // 닉네임 우선 표시, 없으면 이름, 둘 다 없으면 user_id 기반
    const displayName = comment.user_nickname || comment.user?.nickname || comment.user_name || comment.user?.name || `사용자${comment.user_id}` || '익명';

    // 프로필 이미지 (없으면 기본 이미지)
    const profileImage = getProfileImageUrl(comment.user_profile_image || comment.user?.profile_image);

    const isEditing = editingCommentId === comment.id;

    return (
      <div key={comment.id} className="mb-[10px]">
        <div className="min-h-[110px] bg-white border border-gray-200 rounded-lg shadow-md">
          {/* 댓글 헤더 */}
          <div className="px-[30px] h-[50px] flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-[40px] h-[40px] rounded-full overflow-hidden mr-[10px] bg-gray-100 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="프로필"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-gray-400"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                    }}
                  />
                ) : (
                  <DefaultProfileIcon />
                )}
              </div>
              <span className="text-[13px] text-black font-bold mr-[10px]">
                {displayName}
              </span>
              <span className="text-[12px] text-black">{formattedDate}</span>
            </div>
            {isMyComment && !isEditing && (
              <div className="flex gap-[5px]">
                <button
                  onClick={() => handleStartEdit(comment)}
                  className="px-[10px] py-[3px] bg-blue-500 text-white text-[11px] rounded-[4px] hover:bg-blue-600 transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="px-[10px] py-[3px] bg-red-500 text-white text-[11px] rounded-[4px] hover:bg-red-600 transition-colors"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          {/* 댓글 내용 */}
          <div className="px-[30px] pb-[20px]">
            <div className="px-[20px]">
              {isEditing ? (
                // 수정 모드
                <div className="space-y-[10px]">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full min-h-[60px] px-[10px] py-[8px] text-[13px] text-black resize-none outline-none rounded-[5px] border-2 border-[#9EC3E5]"
                  />
                  <div className="flex gap-[5px]">
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      className="px-[15px] py-[5px] bg-[#9ec3e5] text-white text-[12px] rounded-[4px] hover:bg-[#7da9d3] transition-colors"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-[15px] py-[5px] bg-gray-400 text-white text-[12px] rounded-[4px] hover:bg-gray-500 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                // 일반 표시 모드
                <p className="text-[13px] text-[#565656] leading-[1.5] whitespace-pre-wrap">
                  {comment.content || ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <p className="text-[16px] text-gray-500">로딩 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[16px] text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/community')}
            className="px-[20px] py-[10px] bg-[#9ec3e5] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#7da9d3]"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!postData) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[16px] text-gray-500 mb-4">게시글을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate('/community')}
            className="px-[20px] py-[10px] bg-[#9ec3e5] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#7da9d3]"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* LM 커뮤니티 헤더 */}
      <div className="w-full h-[100px] flex items-center justify-center">
        <h1 className="text-[30px] font-bold text-black">LM 커뮤니티</h1>
      </div>

      {/* 카테고리 섹션 */}
      <div className="w-full h-[30px] flex items-center px-[30px]">
        <div className="flex items-center w-full h-full border-b-2 border-[#9EC3E5]">
          <span className="text-[13px] text-black font-normal ml-[10px]">카테고리</span>
          <div className="flex items-center gap-[30px] text-[13px] text-black ml-auto mr-[10px]">
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
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="w-[1020px] mx-auto">

        {/* 게시글 내용 섹션 */}
        <div className="h-[393px]">
          {/* 게시글 제목 헤더 */}
          <div className="pl-[20px] pr-[20px] h-[38px] flex items-center gap-[10px]">
            <div className="w-[80px] h-[23px] flex items-center justify-center">
              <span className="text-[15px] text-black">{postData?.category || '-'}</span>
            </div>
            <div className="w-[2px] h-[15px] bg-gray-400"></div>
            <div className="flex-1 h-[23px] flex items-center">
              <span className="text-[15px] text-black">{postData?.title || ''}</span>
            </div>
            {/* 작성자 정보 */}
            <div className="flex items-center gap-[5px] mr-[10px]">
              <div className="w-[20px] h-[20px] rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {getProfileImageUrl(postData?.user_profile_image) ? (
                  <img
                    src={getProfileImageUrl(postData?.user_profile_image)}
                    alt="작성자"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-gray-400"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                    }}
                  />
                ) : (
                  <DefaultProfileIcon />
                )}
              </div>
              <span className="text-[12px] text-gray-600">
                {postData?.user_nickname || postData?.user_name || '익명'}
              </span>
            </div>
            <div className="flex items-center gap-[3px]">
              <img
                src="/assets/eye_icon.png"
                alt="조회수"
                className="w-[14px] h-[14px] object-contain"
              />
              <span className="text-[12px] text-black">{postData?.views || 0}</span>
            </div>
          </div>

          {/* 게시글 본문 */}
          <div className="px-[50px] h-[340px]">
            <div className="px-[15px] py-[30px] h-full">
              <p className="text-[13px] text-[#565656] leading-[1.6] whitespace-pre-wrap">
                {postData?.content || ''}
              </p>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="py-[20px]">
          {/* 댓글 개수 */}
          <div className="px-[50px] h-[35px] flex items-center">
            <div className="w-full h-full flex items-center border-t-2 border-[#9EC3E5]">
              <span className="text-[13px] font-bold text-black">댓글({comments.length}개)</span>
            </div>
          </div>

          {/* 댓글이 없을 때 메시지 */}
          {comments.length === 0 && (
            <div className="px-[50px] py-[30px] flex items-center justify-center">
              <p className="text-[13px] text-gray-400">첫 댓글을 남겨보세요!</p>
            </div>
          )}

          {/* 댓글 더 보기 */}
          {!showAllComments && comments.length > 5 && (
            <div className="w-[920px] px-[50px] h-[20px] flex items-center justify-center mb-[15px] mx-auto">
              <button
                onClick={handleShowMoreComments}
                className="bg-[#D9D9D9] hover:bg-[#C4C4C4] px-[20px] py-[3px] rounded-[5px] text-[13px] text-black font-medium transition-colors"
              >
                댓글 더 보기
              </button>
            </div>
          )}

          {/* 댓글 목록 */}
          {comments.length > 0 && (
            <div className="px-[50px] py-[10px]">
              <div className="w-[920px]">
                {displayedComments.map(comment => renderComment(comment))}
              </div>
            </div>
          )}
        </div>

        {/* 댓글 작성 */}
        <div className="h-[140px]">
          <div className="px-[50px] py-[20px]">
            <div className="w-[920px] h-[100px] relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 남겨 여러분의 의견을 공유해보세요."
                className="w-full h-full px-[10px] py-[10px] text-[13px] text-black resize-none outline-none rounded-[5px] border-2 border-[#9EC3E5]"
              />
              <button
                onClick={handleCommentSubmit}
                className="absolute right-[10px] top-[10px] w-[80px] h-[80px] bg-[#95B1D4] hover:bg-[#859EBD] flex items-center justify-center text-[14px] text-black font-medium transition-colors rounded-[5px]"
              >
                등록
              </button>
            </div>
          </div>
        </div>

        {/* 커뮤니티 리스트 */}
        <div className="h-[650px]">
          <div className="px-[50px] py-[20px]">
            {/* 테이블 헤더 */}
            <div className="w-[920px] border-b-[2px] border-[#9ec3e5] bg-white flex h-[30px]">
              <div className="w-[100px] h-[30px] flex items-center justify-center text-[13px] text-[#08213b]">번호</div>
              <div className="w-[100px] h-[30px] flex items-center justify-center text-[13px] text-[#08213b]">카테고리</div>
              <div className="w-[560px] h-[30px] flex items-center px-[10px] text-[13px] text-[#08213b]">제목</div>
              <div className="w-[100px] h-[30px] flex items-center justify-center text-[13px] text-[#08213b]">날짜</div>
              <div className="w-[100px] h-[30px] flex items-center justify-center text-[13px] text-[#08213b]">조회</div>
            </div>

            {/* 테이블 로우 */}
            {filteredPosts.map((post) => {
              const formattedDate = post.created_at
                ? new Date(post.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }).replace(/\. /g, '.').replace(/\.$/, '')
                : '-';

              return (
                <div
                  key={post.id}
                  className="w-[920px] bg-white flex h-[30px] hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/community/post/${post.id}`)}
                >
                  <div className="w-[100px] h-[30px] flex items-center justify-center text-[13px] text-black">
                    {post.id}
                  </div>
                  <div className="w-[100px] h-[30px] flex items-center justify-center text-[13px] text-black">
                    {post.category || '-'}
                  </div>
                  <div className="w-[560px] h-[30px] flex items-center px-[10px] text-[13px] text-black">
                    <span className={post.title?.includes('[공지]') ? 'text-red-500' : 'text-black'}>
                      {post.title}
                    </span>
                    {post.comments && post.comments.length > 0 && (
                      <span className="text-red-500 text-[9px] font-medium ml-[4px]">[{post.comments.length}]</span>
                    )}
                  </div>
                  <div className="w-[100px] h-[30px] flex items-center justify-center text-[13px] text-black">
                    {formattedDate}
                  </div>
                  <div className="w-[100px] h-[30px] flex items-center justify-center text-[13px] text-black">
                    {post.views || 0}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="px-[60px] h-[200px] flex items-center justify-center">
            <div className="flex items-center gap-[20px]">
              {/* 이전 버튼 */}
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-[10px] py-[5px] rounded-[5px] text-[12px] font-medium transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#d9d9d9] text-black hover:bg-gray-400'
                }`}
              >
                이전
              </button>

              {/* 페이지 번호 */}
              <div className="flex items-center gap-[10px] text-[12px] text-black font-bold">
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-[25px] h-[25px] flex items-center justify-center rounded transition-all ${
                      page === currentPage
                        ? 'bg-[#9ec3e5] text-white'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* 다음 버튼 */}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-[10px] py-[5px] rounded-[5px] text-[12px] font-medium transition-colors ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#d9d9d9] text-black hover:bg-gray-400'
                }`}
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPostDetail;