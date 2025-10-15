import React, { useState } from 'react';
import { demoCommunityPosts } from '../data/demoData';

const CommunityPage = ({ onPostClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);

  const communityPosts = demoCommunityPosts;

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 선택된 카테고리에 따라 게시글 필터링
  const filteredPosts = selectedCategory === '전체'
    ? communityPosts
    : communityPosts.filter(post => post.category === selectedCategory);

  // 게시글 클릭 핸들러
  const handlePostClick = (post) => {
    // 특정 게시글 (LCK 관련 글)을 클릭했을 때만 상세 페이지로 이동
    if (post.title.includes('[LCK] DRX \'레이지필\' 데뷔!') && onPostClick) {
      onPostClick();
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

          {/* Table Rows */}
          {filteredPosts.map((post, index) => (
            <div
              key={index}
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
                <span className={post.isNotice && post.title.includes('[공지]') ? 'text-red-500' : 'text-black'}>
                  {post.title}
                </span>
                {post.commentCount && (
                  <span className="text-red-500 text-[9px] font-medium ml-[4px]">{post.commentCount}</span>
                )}
              </div>
              <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-black">
                {post.date}
              </div>
              <div className="w-[100px] h-[30px] flex items-center justify-center p-[10px] text-[13px] text-black">
                {post.views}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="h-[207px] flex items-center justify-center">
          <div className="flex items-center gap-[20px]">
            <div className="flex items-center justify-between w-[200px] text-[10px] font-bold text-black">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${currentPage === page ? 'underline' : ''} hover:underline transition-all`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="bg-[#d9d9d9] px-[10px] py-[5px] rounded-[5px] text-[12px] font-medium text-black hover:bg-gray-400 transition-colors">
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
