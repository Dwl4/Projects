import React, { useState } from 'react';
import CaseLawSearchResults from './CaseLawSearchResults';
import CaseLawDetail from './CaseLawDetail';
import { demoCaseLawData } from '../data/demoData';

const imgSearch = "/assets/Search.png";

export default function CaseLawContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseName, setCaseName] = useState('');
  const [reference, setReference] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCaseDetail, setShowCaseDetail] = useState(false);
  const [currentPageGroup, setCurrentPageGroup] = useState(0);

  const handleSearch = () => {
    // 참조조문에 "민법"이 입력되어 있으면 검색 결과 페이지 표시
    if (reference.includes('민법')) {
      setShowSearchResults(true);
    }
  };

  const getPageNumbers = () => {
    const start = currentPageGroup * 9 + 1;
    return Array.from({ length: 9 }, (_, i) => start + i);
  };

  const handlePrevious = () => {
    if (currentPageGroup > 0) {
      setCurrentPageGroup(currentPageGroup - 1);
    }
  };

  const handleNext = () => {
    setCurrentPageGroup(currentPageGroup + 1);
  };

  if (showCaseDetail) {
    return <CaseLawDetail />;
  }

  if (showSearchResults) {
    return <CaseLawSearchResults />;
  }

  return (
    <>

      <div className="px-[30px] py-[10px]">
        {/* 제목 */}
        <div className="py-[10px]">
          <h1 className="text-[30px] font-bold text-black w-[140px]">판례</h1>
        </div>

        {/* 검색 필터 */}
        <div className="flex gap-[10px] items-center justify-center mb-[10px]">
          <div className="p-[10px] w-[300px]">
            <div className="mb-[5px]">
              <label className="text-[15px] font-bold text-black">사건번호</label>
            </div>
            <div className="bg-white border-2 border-[#d9d9d9] px-[10px] py-[5px]">
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                placeholder="예) 2023기합1234"
                className="w-full text-[15px] text-[#787878] bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="p-[10px] w-[300px]">
            <div className="mb-[5px]">
              <label className="text-[15px] font-bold text-black">사건명</label>
            </div>
            <div className="bg-white border-2 border-[#d9d9d9] px-[10px] py-[5px]">
              <input
                type="text"
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                placeholder="예) 손해배상"
                className="w-full text-[15px] text-[#787878] bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="p-[10px] w-[300px]">
            <div className="mb-[5px]">
              <label className="text-[15px] font-bold text-black">참조조문</label>
            </div>
            <div className="bg-white border-2 border-[#d9d9d9] px-[10px] py-[5px]">
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="예)민법 제3조"
                className="w-full text-[15px] text-[#787878] bg-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* 검색 박스 */}
        <div className="flex items-center justify-center px-[200px] py-[10px]">
          <div className="bg-[#d9d9d9] rounded-[10px] flex items-center justify-between px-[10px] py-[5px] w-[477px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력 하세요!"
              className="w-[410px] text-[15px] text-black bg-transparent outline-none"
            />
            <div
              className="w-[35px] h-[35px] bg-center bg-cover bg-no-repeat cursor-pointer"
              style={{ backgroundImage: `url('${imgSearch}')` }}
              onClick={handleSearch}
            />
          </div>
        </div>

        {/* 판례 목록 */}
        <div className="p-[10px]">
          <div className="flex justify-end mb-[5px]">
            <p className="text-[10px] font-bold text-black">조회순↓</p>
          </div>

          {/* 테이블 헤더 */}
          <div className="bg-white border-t border-[#787878] flex">
            <div className="w-[50px] h-[40px] flex items-center justify-center">
              <p className="text-[15px] font-bold text-black">NO</p>
            </div>
            <div className="flex-1 h-[40px] flex items-center justify-center">
              <p className="text-[15px] font-bold text-black">요약정보</p>
            </div>
          </div>

          {/* 테이블 내용 */}
          {demoCaseLawData.map((item) => (
            <div
              key={item.id}
              className="bg-white border-t border-[#787878] flex cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => item.id === 1 && setShowCaseDetail(true)}
            >
              <div className="w-[50px] h-[80px] flex items-center justify-center">
                <p className="text-[15px] text-black">{item.id}</p>
              </div>
              <div className="flex-1 px-[15px] py-[5px] flex flex-col gap-[10px]">
                <div className="flex items-center">
                  <p className="text-[15px] text-[#08213b]">
                    {item.title}
                  </p>
                </div>
                <div className="w-full">
                  <p className="text-[12px] text-[#787878] leading-[1.5]">
                    {item.content}
                  </p>
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
    </>
  );
}