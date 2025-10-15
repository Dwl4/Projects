import React, { useState } from 'react';
import { demoCommunityPosts } from '../data/demoData';

const CommunityPostDetail = () => {
  const [newComment, setNewComment] = useState('');
  const [currentPageGroup, setCurrentPageGroup] = useState(0); // 0: 1-9, 1: 11-19, 2: 21-29, etc.
  const [showAllComments, setShowAllComments] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // 게시글 데이터
  const postData = {
    id: '123450',
    category: '잡담',
    title: '[LCK] DRX \'레이지필\' 데뷔! LCK 최초 순수 외국 국적 용병 등장',
    likes: 242,
    dislikes: 5,
    content: `DRX의 베트남 국적 바텀 라이너 '레이지필' 쩐바오민이 5월 1일 LCK 44번째 경기에서 LCK 데뷔전을 치른다.
2007년생의 어린 나이에도 불구하고 과감하고 저돌적인 플레이 스타일로 주목받아온 '레이지필'은 LCK 역사상 최초의 순수 외국 국적 용병 선수라는 점에서 더욱 큰 의미를 갖는다.
베트남 출신의 '레이지필'은 2023년 DRX 베트남 트라이아웃을 통해 한국 땅을 밟았다. 연습생 시절부터 뛰어난 피지컬과 과감한 플레이로 팀 관계자들의 눈길을 사로잡았으며, DRX 챌린저스 소속으로 꾸준히 경기를 뛰어왔다.

'레이지필'은 이미 2025 LCK 컵 무대에서 팀의 주전이었던 '테디' 박진성의 공백을 훌륭하게 메우며 강렬한 인상을 남긴 바 있다. 당시 그는 번뜩이는 플레이와 뛰어난 캐리력으로 팬들에게 '쌀프트', '쌀꺾마'라는 새로운 별명을 얻기도 했다.

이번 '레이지필'의 LCK 데뷔는 단순한 신인 선수의 등장을 넘어 LCK 역사에 새로운 이정표를 세우는 사건이다. 한국 e스포츠 리그 역사상 순수 외국 국적의 선수가 1군 무대에 데뷔하는 것은 처음이다. '레이지필'의 LCK 데뷔전은 해외 LoL 유망주들에게 LCK 진출의 꿈을 심어줄 것으로 기대된다.

최근 DRX는 주전 원거리 딜러 '테디'의 폼 저하로 어려움을 겪고 있다. 이에 팀은 '레이지필'의 과감한 기용을 통해 분위기 반전을 꾀하려는 것으로 보인다. 과연 '레이지필'이 LCK 무대에 성공적으로 안착하며 팀의 새로운 희망으로 떠오를 수 있을지, 그의 활약에 국내외 팬들의 시선이 집중되고 있다.`

  };

  // 댓글 데이터
  const comments = [
    {
      id: 1,
      author: '뽀로로',
      date: '(25.05.01 14:31:59)',
      content: '최근 DRX는 주전 원거리 딜러 \'테디\'의 폼 저하로 어려움을 겪고 있다. 이에 팀은 \'레이지필\'의 과감한 기용을 통해 분위기 반전을 꾀하려는 것으로 보인다. 과연 \'레이지필\'이 LCK 무대에 성공적으로 안착하며 팀의 새로운 희망으로 떠오를 수 있을지, 그의 활약에 국내외 팬들의 시선이 집중되고 있다.'
    },
    {
      id: 2,
      author: '벼농사',
      date: '(25.05.01 15:01:09)',
      content: '이번 \'레이지필\'의 LCK 데뷔는 단순한 신인 선수의 등장을 넘어 LCK 역사에 새로운 이정표를 세우는 사건이다. 한국 e스포츠 리그 역사상 순수 외국 국적의 선수가 1군 무대에 데뷔하는 것은 처음이다. \'레이지필\'의 LCK 데뷔전은 해외 LoL 유망주들에게 LCK 진출의 꿈을 심어줄 것으로 기대된다.'
    },
    {
      id: 3,
      author: 'BBSDA',
      date: '(25.05.01 15:01:09)',
      content: '최근 DRX는 주전 원거리 딜러 \'테디\'의 폼 저하로 어려움을 겪고 있다. 이에 팀은 \'레이지필\'의 과감한 기용을 통해 분위기 반전을 꾀하려는 것으로 보인다. 과연 \'레이지필\'이 LCK 무대에 성공적으로 안착하며 팀의 새로운 희망으로 떠오를 수 있을지, 그의 활약에 국내외 팬들의 시선이 집중되고 있다.'
    },
    {
      id: 4,
      author: 'GGDDGG',
      date: '(25.05.01 15:01:09)',
      content: '최근 DRX는 주전 원거리 딜러 \'테디\'의 폼 저하로 어려움을 겪고 있다. 이에 팀은 \'레이지필\'의 과감한 기용을 통해 분위기 반전을 꾀하려는 것으로 보인다. 과연 \'레이지필\'이 LCK 무대에 성공적으로 안착하며 팀의 새로운 희망으로 떠오를 수 있을지, 그의 활약에 국내외 팬들의 시선이 집중되고 있다.'
    },
    {
      id: 5,
      author: '랄로',
      date: '(25.05.01 15:01:09)',
      content: '최근 DRX는 주전 원거리 딜러 \'테디\'의 폼 저하로 어려움을 겪고 있다. 이에 팀은 \'레이지필\'의 과감한 기용을 통해 분위기 반전을 꾀하려는 것으로 보인다. 과연 \'레이지필\'이 LCK 무대에 성공적으로 안착하며 팀의 새로운 희망으로 떠오를 수 있을지, 그의 활약에 국내외 팬들의 시선이 집중되고 있다.'
    },
    {
      id: 6,
      author: '홍길동',
      date: '(25.05.01 16:30:22)',
      content: '정말 기대되는 신인 선수네요! 베트남 출신으로 LCK에서 활약하게 되다니, 정말 놀라운 일입니다. 앞으로의 경기가 너무 궁금해요.'
    }
  ];

  const communityPosts = demoCommunityPosts;

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // 댓글 추가 로직
      console.log('새 댓글:', newComment);
      setNewComment('');
    }
  };

  const handlePrevious = () => {
    if (currentPageGroup > 0) {
      setCurrentPageGroup(currentPageGroup - 1);
    }
  };

  const handleNext = () => {
    setCurrentPageGroup(currentPageGroup + 1);
  };

  // 현재 페이지 그룹에 따른 페이지 번호 계산
  const getPageNumbers = () => {
    if (currentPageGroup === 0) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9];
    } else {
      const startPage = currentPageGroup * 10 + 1;
      return Array.from({ length: 9 }, (_, i) => startPage + i);
    }
  };

  const handleShowMoreComments = () => {
    setShowAllComments(true);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // 선택된 카테고리에 따라 게시글 필터링
  const filteredPosts = selectedCategory === '전체'
    ? communityPosts
    : communityPosts.filter(post => post.category === selectedCategory);

  const handleLike = () => {
    if (!hasLiked) {
      setLikeCount(likeCount + 1);
      setHasLiked(true);
    } else {
      setLikeCount(likeCount - 1);
      setHasLiked(false);
    }
  };

  // 표시할 댓글 필터링
  const displayedComments = showAllComments ? comments : comments.slice(0, 5);

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
          <div className="pl-[50px] h-[38px] flex items-center">
            <div className="w-[100px] h-[23px] flex items-center justify-center">
              <span className="text-[15px] text-black">{postData.category}</span>
            </div>
            <div className="w-[2px] h-[15px] bg-gray-400 mx-[10px]"></div>
            <div className="w-[708px] h-[23px] flex items-center px-[5px]">
              <span className="text-[15px] text-black">{postData.title}</span>
            </div>
            <div className="w-[100px] h-[23px] flex items-center justify-center">
              <div className="flex items-center gap-[10px]">
                <div className="flex items-center gap-[3px]">
                  <img
                    src="/assets/eye_icon.png"
                    alt="조회수"
                    className="w-[14px] h-[14px] object-contain"
                  />
                  <span className="text-[12px] text-black">{postData.likes}</span>
                </div>
                <div className="flex items-center gap-[3px]">
                  <img
                    src="/assets/love_icon.png"
                    alt="좋아요"
                    className="w-[14px] h-[14px] object-contain grayscale opacity-50"
                  />
                  <span className="text-[12px] text-gray-400">{likeCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 게시글 본문 */}
          <div className="px-[50px] h-[340px]">
            <div className="px-[15px] py-[30px] h-full">
              <p className="text-[13px] text-[#565656] leading-[1.6] whitespace-pre-wrap">
                {postData.content}
              </p>
            </div>
          </div>
        </div>

        {/* 좋아요 버튼 */}
        <div className="w-[1020px] mx-auto px-[50px] py-[20px] flex justify-center">
          <button
            onClick={handleLike}
            className="flex items-center gap-[8px] px-[10px] py-[5px] transition-all hover:scale-105 cursor-pointer"
          >
            <img
              src="/assets/love_icon.png"
              alt="좋아요"
              className={`w-[35px] h-[35px] object-contain transition-all hover:scale-110 ${
                hasLiked ? 'opacity-100' : likeCount === 0 ? 'grayscale opacity-50' : 'opacity-70'
              }`}
            />
            <span className={`text-[16px] font-bold ${hasLiked ? 'text-red-600' : likeCount === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
              {likeCount}
            </span>
          </button>
        </div>

        {/* 댓글 섹션 */}
        <div className="min-h-[680px]">
          {/* 댓글 개수 */}
          <div className="px-[50px] h-[35px] flex items-center">
            <div className="w-full h-full flex items-center border-t-2 border-[#9EC3E5]">
              <span className="text-[13px] font-bold text-black">댓글({comments.length}개)</span>
            </div>
          </div>

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
          <div className="px-[50px]">
            {displayedComments.map((comment, index) => {
              const heights = [110, 110, 110, 110, 110, 110];
              const contentHeights = [40, 40, 40, 40, 40, 40];
              return (
                <div key={comment.id} className="w-[920px] mb-[10px]">
                  <div className={`h-[${heights[index]}px] bg-white border border-gray-200 rounded-lg shadow-md`}>
                    {/* 댓글 헤더 */}
                    <div className="px-[30px] h-[50px] flex items-center">
                      <div className="w-[40px] h-[40px] rounded-full overflow-hidden mr-[10px]">
                        <img
                          src="/assets/Login_Image.png"
                          alt="프로필"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[13px] text-black font-bold mr-[10px]">{comment.author}</span>
                      <span className="text-[12px] text-black">{comment.date}</span>
                    </div>

                    {/* 댓글 내용 */}
                    <div className="px-[30px]">
                      <div className="px-[20px]">
                        <p className={`text-[13px] text-[#565656] leading-[1.5] h-[${contentHeights[index]}px]`}>
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
            {filteredPosts.map((post, index) => (
              <div key={index} className="w-[920px] bg-white flex h-[30px] hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-[100px] h-[30px] flex items-center justify-center text-[13px] text-black">
                  {post.id}
                </div>
                <div className="w-[100px] h-[30px] flex items-center justify-center text-[13px] text-black">
                  {post.category}
                </div>
                <div className="w-[560px] h-[30px] flex items-center px-[10px] text-[13px] text-black">
                  <span className={post.isNotice && post.title.includes('[공지]') ? 'text-red-500' : 'text-black'}>
                    {post.title}
                  </span>
                  {post.commentCount && (
                    <span className="text-red-500 text-[9px] font-medium ml-[4px]">{post.commentCount}</span>
                  )}
                </div>
                <div className="w-[100px] h-[30px] flex items-center justify-center text-[13px] text-black">
                  {post.date}
                </div>
                <div className="w-[100px] h-[30px] flex items-center justify-center text-[13px] text-black">
                  {post.views}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="px-[60px] h-[200px] flex items-center justify-center">
          <div className="flex items-center gap-[20px] w-[320px]">
            {currentPageGroup > 0 && (
              <button
                onClick={handlePrevious}
                className="bg-[#d9d9d9] px-[5px] py-[5px] rounded-[5px] text-[12px] font-medium text-black hover:bg-gray-400 transition-colors"
              >
                이전
              </button>
            )}
            <div className="flex items-center justify-between w-[200px] text-[10px] text-black font-bold">
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  className={`${page === 1 ? 'underline' : ''} hover:underline transition-all`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="bg-[#d9d9d9] px-[5px] py-[5px] rounded-[5px] text-[12px] font-medium text-black hover:bg-gray-400 transition-colors"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPostDetail;