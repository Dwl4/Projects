import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dictionaryService } from '../api';

const imgSearch = "/assets/Search.png";

const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 메인 컨텐츠만 추출한 컴포넌트
export function DictionaryContent() {
  const navigate = useNavigate();
  const [selectedConsonant, setSelectedConsonant] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageGroup, setCurrentPageGroup] = useState(0);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 용어 데이터 가져오기
  const fetchTerms = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 15,
      };

      // 검색어가 있으면 추가
      if (searchQuery.trim()) {
        params.keyword = searchQuery.trim();
      }

      // 초성 필터가 '전체'가 아니면 추가
      if (selectedConsonant !== '전체') {
        params.consonant = selectedConsonant;
      }

      const response = await dictionaryService.searchTerms(params);
      setTerms(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (err) {
      console.error('용어 조회 실패:', err);
      setError('용어를 불러오는데 실패했습니다.');
      setTerms([]);
    } finally {
      setLoading(false);
    }
  };

  // 초성 변경, 검색어 변경, 페이지 변경 시 데이터 가져오기
  useEffect(() => {
    fetchTerms();
  }, [selectedConsonant, currentPage]);

  // 검색어 입력 후 엔터키 처리
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      fetchTerms();
    }
  };

  const getPageNumbers = () => {
    const start = currentPageGroup * 9 + 11;
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

  return (
    <>
      <div className="px-[30px] flex-1">
        {/* 제목 */}
        <div className="py-[10px] h-[65px] flex items-center">
          <h1 className="text-[30px] font-bold text-black">법률사전</h1>
        </div>

        {/* 초성 필터 */}
        <div className="h-[50px] flex items-center justify-center gap-[10px] px-[205px]">
          {/* 전체 버튼 */}
          <button
            onClick={() => setSelectedConsonant('전체')}
            className={`w-[50px] h-[30px] flex items-center justify-center font-bold text-[20px] ${
              selectedConsonant === '전체'
                ? 'bg-[#9ec3e5] text-black shadow-[3px_3px_3px_0px_rgba(0,0,0,0.55)]'
                : 'bg-white text-black border border-black'
            }`}
          >
            전체
          </button>
          {consonants.map((consonant) => (
            <button
              key={consonant}
              onClick={() => setSelectedConsonant(consonant)}
              className={`w-[30px] h-[30px] flex items-center justify-center font-bold text-[20px] ${
                selectedConsonant === consonant
                  ? 'bg-[#9ec3e5] text-black shadow-[3px_3px_3px_0px_rgba(0,0,0,0.55)]'
                  : 'bg-white text-black border border-black'
              }`}
            >
              {consonant}
            </button>
          ))}
        </div>

        {/* 검색 박스 */}
        <div className="h-[50px] flex items-center justify-center px-[241.5px] py-[10px]">
          <div className="bg-[#d9d9d9] rounded-[10px] flex items-center justify-between px-[10px] w-[477px] h-[45px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              placeholder="검색어를 입력 하세요!"
              className="w-[410px] text-[15px] text-black bg-transparent outline-none placeholder-[#787878]"
            />
            <div
              className="w-[35px] h-[35px] bg-center bg-cover bg-no-repeat cursor-pointer"
              style={{ backgroundImage: `url('${imgSearch}')` }}
              onClick={() => {
                setCurrentPage(1);
                fetchTerms();
              }}
            />
          </div>
        </div>

        {/* 테이블 */}
        <div className="px-[10px] py-[10px] h-[660px]">
          {/* 헤더 */}
          <div className="flex h-[40px] bg-[#eeeeee]">
            <div className="w-[200px] flex items-center justify-center border-t-2 border-b-2 border-[#d9d9d9]">
              <p className="text-[15px] font-bold text-black">용어</p>
            </div>
            <div className="flex-1 flex items-center justify-center border-t-2 border-b-2 border-[#d9d9d9]">
              <p className="text-[15px] font-bold text-black">내용</p>
            </div>
          </div>

          {/* 로딩 상태 */}
          {loading && (
            <div className="flex items-center justify-center h-[600px]">
              <p className="text-[15px] text-gray-500">로딩 중...</p>
            </div>
          )}

          {/* 에러 상태 */}
          {error && !loading && (
            <div className="flex items-center justify-center h-[600px]">
              <p className="text-[15px] text-red-500">{error}</p>
            </div>
          )}

          {/* 데이터 없음 */}
          {!loading && !error && terms.length === 0 && (
            <div className="flex items-center justify-center h-[600px]">
              <p className="text-[15px] text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}

          {/* 내용 - 15개 행 */}
          {!loading && !error && terms.length > 0 && terms.map((item) => (
            <div
              key={item.id || item.term_id}
              onClick={() => navigate(`/dictionary/${item.id || item.term_id}`)}
              className="flex h-[40px] cursor-pointer hover:bg-gray-100 border-b border-[#d9d9d9]"
            >
              <div className="w-[200px] flex items-center justify-center">
                <p className="text-[15px] text-black">{item.term || item.term_name}</p>
              </div>
              <div className="flex-1 flex items-center px-[15px]">
                <p className="text-[15px] text-black truncate">{item.definition || item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="h-[200px] flex items-center justify-center">
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

export default DictionaryContent;
