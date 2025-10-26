import React, { useState, useEffect } from 'react';
import NoticeDetail from './NoticeDetail';
import { demoNotices } from '../data/demoNoticeData';

export default function NoticePage() {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notices, setNotices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' 또는 'views'
  const [sortDirection, setSortDirection] = useState('desc'); // 'desc' 또는 'asc'
  const itemsPerPage = 5;

  // 공지사항 목록 조회 (데모 데이터 사용)
  useEffect(() => {
    // 정렬 적용
    let sortedNotices = [...demoNotices];
    if (sortOrder === 'views') {
      // 조회순 정렬
      if (sortDirection === 'desc') {
        sortedNotices.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else {
        sortedNotices.sort((a, b) => (a.views || 0) - (b.views || 0));
      }
    } else {
      // 최신순 정렬
      if (sortDirection === 'desc') {
        sortedNotices.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        sortedNotices.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    }

    // 페이지네이션 적용
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setNotices(sortedNotices.slice(startIndex, endIndex));

    // 총 페이지 수 계산
    const total = Math.ceil(sortedNotices.length / itemsPerPage);
    setTotalPages(total);
  }, [currentPage, sortOrder, sortDirection]);

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

  // 페이지 그룹 계산 (한 번에 10개 페이지씩 표시)
  const getPageNumbers = () => {
    const pageGroupSize = 10;
    const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
    const startPage = currentGroup * pageGroupSize + 1;
    const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePrevious = () => {
    const pageGroupSize = 10;
    const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
    const newPage = Math.max(1, currentGroup * pageGroupSize);
    setCurrentPage(newPage);
  };

  const handleNext = () => {
    const pageGroupSize = 10;
    const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
    const newPage = Math.min(totalPages, (currentGroup + 1) * pageGroupSize + 1);
    setCurrentPage(newPage);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // 정렬 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder, sortDirection]);

  // 이전/다음 공지사항 이동 (상세보기용)
  const handlePreviousNotice = () => {
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

  const handleNextNotice = () => {
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
        onPrevious={handlePreviousNotice}
        onNext={handleNextNotice}
      />
    );
  }

  // 목록보기일 때
  return (
    <div className="w-full bg-white flex flex-col items-center">

      {/* 공지사항 제목 섹션 */}
      <div className="w-full h-[150px] flex items-center justify-center">
        <h1 className="text-[32px] font-bold text-black">공지사항</h1>
      </div>

      {/* 정렬 선택 */}
      <div className="w-[900px] mb-[23px] flex justify-end gap-[15px]">
        <button
          onClick={() => {
            if (sortOrder === 'latest') {
              setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
            } else {
              setSortOrder('latest');
              setSortDirection('desc');
            }
          }}
          className={`text-[16px] ${
            sortOrder === 'latest' ? 'text-black font-bold' : 'text-gray-400'
          }`}
        >
          최신순 {sortOrder === 'latest' && (sortDirection === 'desc' ? '▼' : '▲')}
        </button>
        <button
          onClick={() => {
            if (sortOrder === 'views') {
              setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
            } else {
              setSortOrder('views');
              setSortDirection('desc');
            }
          }}
          className={`text-[16px] ${
            sortOrder === 'views' ? 'text-black font-bold' : 'text-gray-400'
          }`}
        >
          조회순 {sortOrder === 'views' && (sortDirection === 'desc' ? '▼' : '▲')}
        </button>
      </div>

      {/* 공지사항 목록 */}
      <div className="w-[900px] space-y-[16px]">
        {/* 공지사항 */}
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="w-[900px] h-[115px] border border-gray-200 mx-auto cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleNoticeClick(notice)}
          >
            <div className="p-[15px]">
              {/* 제목과 날짜 */}
              <div className="flex items-center justify-between h-[35px] mb-[5px]">
                <h2 className="text-[22px] font-bold text-black leading-[28px]">{notice.title}</h2>
                <span className="text-[14px] text-black">{notice.date}</span>
              </div>

              {/* 내용과 조회수 */}
              <div className="flex items-center justify-between h-[35px]">
                <p className="text-[14px] text-black leading-[21px] truncate max-w-[700px]">
                  {notice.content}
                </p>
                <span className="text-[10px] text-black">조회 수 {notice.views || 0}</span>
              </div>
            </div>
          </div>
        ))}

        {/* 공지사항이 없을 때 */}
        {notices.length === 0 && (
          <div className="w-[900px] h-[400px] flex items-center justify-center">
            <p className="text-[18px] text-gray-600">등록된 공지사항이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <div className="h-[200px] flex items-center justify-center">
          <div className="flex items-center gap-[20px]">
            {/* 이전 버튼 영역 (고정 너비) */}
            <div className="w-[50px] flex items-center justify-center">
              {getPageNumbers()[0] > 1 && (
                <button
                  onClick={handlePrevious}
                  className="bg-[#d9d9d9] px-[10px] py-[5px] rounded-[5px] text-[12px] font-medium text-black hover:bg-gray-400 transition-colors w-[50px]"
                >
                  이전
                </button>
              )}
            </div>

            {/* 페이지 번호들 (10개씩) - 고정 크기 버튼 */}
            <div className="flex items-center gap-[10px] text-[12px] text-black font-bold">
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`w-[30px] h-[30px] flex items-center justify-center rounded ${
                    page === currentPage
                      ? 'bg-[#9ec3e5] text-black'
                      : 'hover:bg-gray-200'
                  } transition-all`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* 다음 버튼 영역 (고정 너비) */}
            <div className="w-[50px] flex items-center justify-center">
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <button
                  onClick={handleNext}
                  className="bg-[#d9d9d9] px-[10px] py-[5px] rounded-[5px] text-[12px] font-medium text-black hover:bg-gray-400 transition-colors w-[50px]"
                >
                  다음
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
