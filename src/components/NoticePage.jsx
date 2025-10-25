import React, { useState, useEffect } from 'react';
import NoticeDetail from './NoticeDetail';
import { demoNotices } from '../data/demoData';

export default function NoticePage() {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageGroup, setCurrentPageGroup] = useState(0);
  const [notices, setNotices] = useState([]);
  const [pinnedNotices, setPinnedNotices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // 공지사항 목록 조회 (데모 데이터 사용)
  useEffect(() => {
    // 고정 공지사항과 일반 공지사항 분리
    const pinned = demoNotices.filter(notice => notice.category === '공지');
    const regular = demoNotices.filter(notice => notice.category !== '공지');

    setPinnedNotices(pinned);

    // 페이지네이션 적용
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setNotices(regular.slice(startIndex, endIndex));

    // 총 페이지 수 계산
    const total = Math.ceil(regular.length / itemsPerPage);
    setTotalPages(total);
  }, [currentPage]);

  // 공지사항 클릭 핸들러
  const handleNoticeClick = (notice) => {
    // fullContent가 있으면 사용, 없으면 content 사용
    const detailNotice = {
      ...notice,
      content: notice.fullContent || notice.content
    };
    setSelectedNotice(detailNotice);
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setSelectedNotice(null);
  };

  // 페이지네이션 함수
  const getPageNumbers = () => {
    const start = currentPageGroup * 9 + 1;
    const end = Math.min(start + 8, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handlePagePrevious = () => {
    if (currentPageGroup > 0) {
      setCurrentPageGroup(currentPageGroup - 1);
      setCurrentPage((currentPageGroup - 1) * 9 + 1);
    }
  };

  const handlePageNext = () => {
    const nextGroupStart = (currentPageGroup + 1) * 9 + 1;
    if (nextGroupStart <= totalPages) {
      setCurrentPageGroup(currentPageGroup + 1);
      setCurrentPage(nextGroupStart);
    }
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // 이전/다음 공지사항 이동
  const handlePrevious = () => {
    if (selectedNotice) {
      const allNotices = demoNotices;
      const currentIndex = allNotices.findIndex(n => n.id === selectedNotice.id);
      if (currentIndex > 0) {
        const prevNotice = allNotices[currentIndex - 1];
        const detailNotice = {
          ...prevNotice,
          content: prevNotice.fullContent || prevNotice.content
        };
        setSelectedNotice(detailNotice);
      }
    }
  };

  const handleNext = () => {
    if (selectedNotice) {
      const allNotices = demoNotices;
      const currentIndex = allNotices.findIndex(n => n.id === selectedNotice.id);
      if (currentIndex < allNotices.length - 1) {
        const nextNotice = allNotices[currentIndex + 1];
        const detailNotice = {
          ...nextNotice,
          content: nextNotice.fullContent || nextNotice.content
        };
        setSelectedNotice(detailNotice);
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
          {/* 고정 공지사항 */}
          {pinnedNotices.map((notice) => (
            <div
              key={notice.id}
              className="w-[900px] h-[125px] border-2 border-blue-500 bg-blue-50 mx-auto cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => handleNoticeClick(notice)}
            >
              <div className="p-[15px]">
                {/* 제목과 날짜 */}
                <div className="flex items-center justify-between h-[45px] mb-[5px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-blue-600 bg-blue-200 px-2 py-1 rounded">고정</span>
                    <h2 className="text-[22px] font-bold text-black leading-[38px]">{notice.title}</h2>
                  </div>
                  <span className="text-[14px] text-black">{notice.date}</span>
                </div>

                {/* 내용과 조회수 */}
                <div className="flex items-center justify-between h-[45px]">
                  <p className="text-[14px] text-black leading-[21px] truncate max-w-[700px]">
                    {notice.content}
                  </p>
                  <span className="text-[10px] text-black">조회 수 {notice.views || 0}</span>
                </div>
              </div>
            </div>
          ))}

          {/* 일반 공지사항 */}
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
                  <p className="text-[14px] text-black leading-[21px] truncate max-w-[700px]">
                    {notice.content}
                  </p>
                  <span className="text-[10px] text-black">조회 수 {notice.views || 0}</span>
                </div>
              </div>
            </div>
          ))}

        {/* 공지사항이 없을 때 */}
        {pinnedNotices.length === 0 && notices.length === 0 && (
          <div className="w-[900px] h-[400px] flex items-center justify-center">
            <p className="text-[18px] text-gray-600">등록된 공지사항이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 0 && (
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
                  onClick={() => handlePageClick(page)}
                  className={`${page === currentPage ? 'underline' : ''} hover:underline transition-all`}
                >
                  {page}
                </button>
              ))}
            </div>
            {(currentPageGroup + 1) * 9 < totalPages && (
              <button
                onClick={handlePageNext}
                className="bg-[#d9d9d9] px-[5px] py-[5px] rounded-[5px] text-[12px] font-medium text-black hover:bg-gray-400 transition-colors"
              >
                다음
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
