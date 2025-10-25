import React, { useState, useEffect } from 'react';
import CaseLawSearchResults from './CaseLawSearchResults';
import CaseLawDetail from './CaseLawDetail';
import { caseLawService } from '../api';

const imgSearch = "/assets/Search.png";

export default function CaseLawContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseName, setCaseName] = useState('');
  const [reference, setReference] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCaseDetail, setShowCaseDetail] = useState(false);
  const [selectedCaseLawId, setSelectedCaseLawId] = useState(null);
  const [currentPageGroup, setCurrentPageGroup] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [caseLawList, setCaseLawList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  // 초기 판례 목록 로드
  useEffect(() => {
    loadCaseLaws();
  }, [currentPage]);

  const loadCaseLaws = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await caseLawService.searchCaseLaws({
        page: currentPage,
        limit: 10
      });
      setCaseLawList(response.data || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      console.error('판례 목록 로드 실패:', err);
      setError('판례 목록을 불러오는데 실패했습니다.');
      setCaseLawList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        keyword: searchQuery,
        case_number: caseNumber,
        case_name: caseName,
        reference: reference,
        page: 1,
        limit: 10
      };

      const response = await caseLawService.searchCaseLaws(params);
      setCaseLawList(response.data || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(1);
      setCurrentPageGroup(0);

      // 검색 결과가 있으면 검색 결과 페이지 표시
      if (response.data && response.data.length > 0) {
        setShowSearchResults(true);
      }
    } catch (err) {
      console.error('판례 검색 실패:', err);
      setError('판례 검색에 실패했습니다.');
      setCaseLawList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCaseLawClick = (caseLawId) => {
    setSelectedCaseLawId(caseLawId);
    setShowCaseDetail(true);
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

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  if (showCaseDetail && selectedCaseLawId) {
    return <CaseLawDetail caseLawId={selectedCaseLawId} />;
  }

  if (showSearchResults) {
    return <CaseLawSearchResults searchResults={caseLawList} />;
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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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

        {/* 에러 메시지 */}
        {error && (
          <div className="px-[10px] mb-[10px]">
            <div className="bg-red-50 border border-red-200 rounded-[5px] px-[15px] py-[10px]">
              <p className="text-[14px] text-red-600">{error}</p>
            </div>
          </div>
        )}

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
          {loading ? (
            <div className="bg-white border-t border-[#787878] flex items-center justify-center h-[200px]">
              <p className="text-[15px] text-[#787878]">로딩 중...</p>
            </div>
          ) : caseLawList.length === 0 ? (
            <div className="bg-white border-t border-[#787878] flex items-center justify-center h-[200px]">
              <p className="text-[15px] text-[#787878]">검색 결과가 없습니다.</p>
            </div>
          ) : (
            caseLawList.map((item, index) => (
              <div
                key={item.case_law_id || index}
                className="bg-white border-t border-[#787878] flex cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleCaseLawClick(item.case_law_id)}
              >
                <div className="w-[50px] h-[80px] flex items-center justify-center">
                  <p className="text-[15px] text-black">
                    {(currentPage - 1) * 10 + index + 1}
                  </p>
                </div>
                <div className="flex-1 px-[15px] py-[5px] flex flex-col gap-[10px]">
                  <div className="flex items-center">
                    <p className="text-[15px] text-[#08213b]">
                      {item.case_number} - {item.case_name || item.title}
                    </p>
                  </div>
                  <div className="w-full">
                    <p className="text-[12px] text-[#787878] leading-[1.5]">
                      {item.summary || item.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
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
                  onClick={() => handlePageClick(page)}
                  className={`${page === currentPage ? 'underline' : ''} hover:underline transition-all`}
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