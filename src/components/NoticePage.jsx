import React, { useState } from 'react';
import NoticeDetail from './NoticeDetail';
import { demoNotices } from '../data/demoData';

export default function NoticePage() {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [currentPageGroup, setCurrentPageGroup] = useState(0);
  const notices = demoNotices;

  // 공지사항 클릭 핸들러
  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setSelectedNotice(null);
  };

  // 페이지네이션 함수
  const getPageNumbers = () => {
    const start = currentPageGroup * 9 + 1;
    return Array.from({ length: 9 }, (_, i) => start + i);
  };

  const handlePagePrevious = () => {
    if (currentPageGroup > 0) {
      setCurrentPageGroup(currentPageGroup - 1);
    }
  };

  const handlePageNext = () => {
    setCurrentPageGroup(currentPageGroup + 1);
  };

  // 이전/다음 공지사항 이동
  const handlePrevious = () => {
    if (selectedNotice) {
      const currentIndex = notices.findIndex(n => n.id === selectedNotice.id);
      if (currentIndex > 0) {
        setSelectedNotice(notices[currentIndex - 1]);
      }
    }
  };

  const handleNext = () => {
    if (selectedNotice) {
      const currentIndex = notices.findIndex(n => n.id === selectedNotice.id);
      if (currentIndex < notices.length - 1) {
        setSelectedNotice(notices[currentIndex + 1]);
      }
    }
  };

  // 상세보기일 때
  if (selectedNotice) {
    return (
      <NoticeDetail
        notice={selectedNotice}
        onBack={handleBackToList}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    );
  }

  // 목록보기일 때
  return (
    <div className="w-full bg-white flex flex-col items-center">
      
      {/* 공지사항 제목 섹션 */}
      <div className="w-full h-[170px] flex items-center justify-center">
        <h1 className="text-[32px] font-bold text-black">공지사항</h1>
      </div>

      {/* 조회 순 정렬 */}
      <div className="w-[900px] mb-[23px] flex justify-end">
        <span className="text-[16px] text-black">조회 순 ▼</span>
      </div>

      {/* 공지사항 목록 */}
      <div className="w-[900px] space-y-[16px]">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="w-[900px] h-[125px] border border-gray-200 mx-auto cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleNoticeClick(notice)}
          >
            <div className="p-[15px]">
              {/* 제목과 날짜 */}
              <div className="flex items-center justify-between h-[45px] mb-[5px]">
                <h2 className="text-[22px] font-bold text-black leading-[38px]">{notice.title}</h2>
                <span className="text-[14px] text-black">{notice.date}</span>
              </div>

              {/* 내용과 조회수 */}
              <div className="flex items-center justify-between h-[45px]">
                <p className="text-[14px] text-black leading-[21px]">{notice.content}</p>
                <span className="text-[10px] text-black">조회 수 {notice.views}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="px-[60px] h-[200px] flex items-center justify-center">
        <div className="flex items-center gap-[20px] w-[320px]">
          {currentPageGroup > 0 && (
            <button
              onClick={handlePagePrevious}
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
            onClick={handlePageNext}
            className="bg-[#d9d9d9] px-[5px] py-[5px] rounded-[5px] text-[12px] font-medium text-black hover:bg-gray-400 transition-colors"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
