import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCaseLawsFromGov } from '../api/caseLawService';

const imgSearch = "/assets/Search.png";

export default function CaseLawSearchResults({ searchResults: initialResults = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseName, setCaseName] = useState('');
  const [reference, setReference] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(initialResults.length);
  const [totalPages, setTotalPages] = useState(Math.ceil(initialResults.length / 10));

  const navigate = useNavigate();

  // prop으로 받은 초기 결과를 state에 반영
  useEffect(() => {
    console.log('🔍 CaseLawSearchResults 초기 결과:', initialResults);
    if (initialResults && initialResults.length > 0) {
      setSearchResults(initialResults);
      setTotalCount(initialResults.length);
      setTotalPages(Math.ceil(initialResults.length / 10));
    }
  }, [initialResults]);

  // 검색 실행 (국가법령정보 API 사용)
  const handleSearch = async () => {
    if (!caseNumber && !caseName && !reference && !searchQuery) {
      setError('검색어를 하나 이상 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // API 파라미터 설정
      const searchParams = {
        page: currentPage,
        display: 10
      };

      // 검색 키워드 설정
      if (searchQuery) {
        searchParams.keyword = searchQuery;
      }
      if (caseNumber) {
        searchParams.caseNumber = caseNumber;
      }
      if (caseName) {
        searchParams.caseName = caseName;
      }
      if (reference) {
        searchParams.reference = reference;
      }

      console.log('검색 파라미터:', searchParams);

      const response = await searchCaseLawsFromGov(searchParams);

      console.log('API 응답:', response);

      // API 응답 처리
      if (response && response.PrecSearch && response.PrecSearch.prec) {
        const precData = response.PrecSearch.prec;
        const results = Array.isArray(precData) ? precData : [precData];

        const formattedResults = results.map((item, index) => ({
          id: (currentPage - 1) * 10 + index + 1,
          caseLawId: item.판례일련번호,
          case_law_id: item.판례일련번호,
          case_number: item.사건번호,
          case_name: item.사건명,
          court_name: item.법원명,
          judgment_date: item.선고일자,
          title: item.사건명,
          subtitle: `${item.법원명 || ''} ${item.사건번호 || ''} ${item.선고일자 || ''}`.trim(),
          content: item.사건명 || '내용 없음',
          highlighted: true
        }));

        setSearchResults(formattedResults);
        const total = parseInt(response.PrecSearch.totalCnt) || formattedResults.length;
        setTotalCount(total);
        setTotalPages(Math.ceil(total / 10));

        if (formattedResults.length === 0) {
          setError('검색 결과가 없습니다.');
        }
      } else {
        setSearchResults([]);
        setError('검색 결과가 없습니다.');
      }
    } catch (err) {
      console.error('판례 검색 오류:', err);
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      setSearchResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // 엔터키 검색
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 판례 클릭 시 상세 페이지로 이동
  const handleCaseLawClick = (caseLawData) => {
    if (caseLawData) {
      navigate('/case-law-detail', { state: { caseLawData } });
    }
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
    // 페이지 변경 시 자동 검색
    if (caseNumber || caseName || reference || searchQuery) {
      handleSearch();
    }
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ?
        <span key={index} className="text-[#ff3333]">{part}</span> : part
    );
  };

  return (
    <>
      <div className="px-[30px] py-[10px]">
        {/* 제목 */}
        <div className="py-[10px]">
          <h1 className="text-[30px] font-bold text-black w-[140px]">판례</h1>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* 로딩 메시지 */}
        {loading && (
          <div className="text-center py-4">
            <p className="text-[18px] text-black">검색 중...</p>
          </div>
        )}

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
                onKeyDown={handleKeyDown}
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
                onKeyDown={handleKeyDown}
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
                onKeyDown={handleKeyDown}
                placeholder="예) 민법"
                className="w-full text-[15px] text-black bg-transparent outline-none"
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
              onKeyDown={handleKeyDown}
              placeholder="검색어를 입력 하세요!"
              className="w-[410px] text-[15px] text-black bg-transparent outline-none"
            />
            <div
              className="w-[35px] h-[35px] bg-center bg-cover bg-no-repeat cursor-pointer hover:opacity-70"
              style={{ backgroundImage: `url('${imgSearch}')` }}
              onClick={handleSearch}
            />
          </div>
        </div>

        {/* 검색 결과 개수 */}
        {totalCount > 0 && (
          <div className="px-[10px] py-[5px]">
            <p className="text-[14px] text-[#787878]">총 {totalCount}건의 판례가 검색되었습니다.</p>
          </div>
        )}

        {/* 판례 목록 */}
        <div className="p-[10px]">
          {/* 테이블 헤더 */}
          <div className="bg-white border-t border-[#787878] flex">
            <div className="w-[50px] h-[40px] flex items-center justify-center">
              <p className="text-[15px] font-bold text-black">NO</p>
            </div>
            <div className="flex-1 h-[40px] flex items-center justify-center">
              <p className="text-[15px] font-bold text-black">요약정보</p>
            </div>
          </div>

          {/* 검색 결과 */}
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div
                key={result.caseLawId || result.case_law_id || index}
                className="bg-white border-t border-[#787878] flex cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleCaseLawClick(result)}
              >
                <div className="w-[50px] h-[80px] flex items-center justify-center">
                  <p className="text-[15px] text-black">{(currentPage - 1) * 10 + index + 1}</p>
                </div>
                <div className="flex-1 px-[15px] py-[5px] flex flex-col gap-[10px]">
                  <div className="flex items-center">
                    <p className="text-[15px] text-[#08213b] font-medium">
                      {result.title}
                    </p>
                  </div>
                  <div className="w-full">
                    <p className="text-[12px] text-[#787878] leading-[1.5]">
                      {result.highlighted ? highlightText(result.content, reference || searchQuery) : result.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="bg-white border-t border-[#787878] py-[40px] text-center">
                <p className="text-[15px] text-[#787878]">검색 결과가 없습니다.</p>
              </div>
            )
          )}
        </div>

        {/* 페이지네이션 */}
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
      </div>
    </>
  );
}