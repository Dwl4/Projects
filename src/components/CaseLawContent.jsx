import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaseLawSearchResults from './CaseLawSearchResults';
import { searchCaseLawsFromGov } from '../api/caseLawService';

const imgSearch = "/assets/Search.png";

export default function CaseLawContent() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [caseName, setCaseName] = useState('');
  const [reference, setReference] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [caseLawList, setCaseLawList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // 초기 판례 목록 로드 (최신 판례)
  useEffect(() => {
    loadCaseLaws();
  }, [currentPage]);

  const loadCaseLaws = async () => {
    try {
      setLoading(true);
      setError(null);

      // 최신 판례 10개 로드 (키워드 없이)
      const response = await searchCaseLawsFromGov({
        page: currentPage,
        display: 10
      });

      if (response && response.PrecSearch && response.PrecSearch.prec) {
        const precData = response.PrecSearch.prec;
        const results = Array.isArray(precData) ? precData : [precData];

        console.log('📋 검색 API 응답 전체 필드:', results[0]);

        const formattedList = results.map((item) => ({
          case_law_id: item.판례일련번호,
          caseLawId: item.판례일련번호,
          case_number: item.사건번호,
          case_name: item.사건명,
          court_name: item.법원명,
          judgment_date: item.선고일자,
          summary: item.사건명,
          title: item.사건명,
          subtitle: `${item.법원명 || ''} ${item.선고일자 || ''} ${item.사건번호 || ''}`.trim(),
          content: item.사건명 || '내용 없음'
        }));

        setCaseLawList(formattedList);

        // totalPages 계산
        const total = parseInt(response.PrecSearch.totalCnt) || formattedList.length;
        setTotalPages(Math.ceil(total / 10));
      } else {
        setCaseLawList([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('판례 목록 로드 실패:', err);
      setError('판례 목록을 불러오는데 실패했습니다.');
      setCaseLawList([]);
      setTotalPages(1);
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
        caseNumber: caseNumber,
        caseName: caseName,
        reference: reference,
        page: 1,
        display: 10
      };

      const response = await searchCaseLawsFromGov(params);

      if (response && response.PrecSearch && response.PrecSearch.prec) {
        const precData = response.PrecSearch.prec;
        const results = Array.isArray(precData) ? precData : [precData];

        const formattedList = results.map((item) => ({
          case_law_id: item.판례일련번호,
          caseLawId: item.판례일련번호,
          case_number: item.사건번호,
          case_name: item.사건명,
          court_name: item.법원명,
          judgment_date: item.선고일자,
          summary: item.사건명,
          title: item.사건명,
          subtitle: `${item.법원명 || ''} ${item.선고일자 || ''} ${item.사건번호 || ''}`.trim(),
          content: item.사건명 || '내용 없음'
        }));

        console.log('🔎 CaseLawContent 검색 결과:', formattedList);
        setCaseLawList(formattedList);
        setCurrentPage(1);

        // 검색 결과가 있으면 검색 결과 페이지 표시
        if (formattedList.length > 0) {
          console.log('✅ 검색 결과 페이지로 전환, 결과 개수:', formattedList.length);
          setShowSearchResults(true);
        }
      } else {
        setCaseLawList([]);
        setError('검색 결과가 없습니다.');
      }
    } catch (err) {
      console.error('판례 검색 실패:', err);
      setError('판례 검색에 실패했습니다.');
      setCaseLawList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCaseLawClick = (caseLawData) => {
    navigate('/case-law-detail', { state: { caseLawData } });
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                onClick={() => handleCaseLawClick(item)}
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