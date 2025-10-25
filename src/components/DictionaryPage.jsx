import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoDictionaryData } from '../data/demoData';

const imgSearch = "/assets/Search.png";

const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 초성 추출 함수
const getInitialConsonant = (char) => {
  const code = char.charCodeAt(0) - 44032;
  if (code < 0 || code > 11171) return null;
  const consonantIndex = Math.floor(code / 588);
  return consonants[consonantIndex];
};

// 메인 컨텐츠만 추출한 컴포넌트
export function DictionaryContent() {
  const navigate = useNavigate();
  const [selectedConsonant, setSelectedConsonant] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageGroup, setCurrentPageGroup] = useState(0);
  const [terms, setTerms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  // 용어 데이터 필터링 및 페이지네이션
  useEffect(() => {
    let filteredTerms = [...demoDictionaryData];

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filteredTerms = filteredTerms.filter(term =>
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query)
      );
    }

    // 초성 필터링
    if (selectedConsonant !== '전체') {
      filteredTerms = filteredTerms.filter(term => {
        const firstChar = term.term.charAt(0);
        return getInitialConsonant(firstChar) === selectedConsonant;
      });
    }

    // 총 페이지 수 계산
    const total = Math.ceil(filteredTerms.length / itemsPerPage);
    setTotalPages(total);

    // 현재 페이지에 해당하는 항목만 표시
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setTerms(filteredTerms.slice(startIndex, endIndex));
  }, [selectedConsonant, searchQuery, currentPage]);

  // 검색어 입력 후 엔터키 처리
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
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
              onClick={() => setCurrentPage(1)}
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

          {/* 데이터 없음 */}
          {terms.length === 0 && (
            <div className="flex items-center justify-center h-[600px]">
              <p className="text-[15px] text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}

          {/* 내용 - 15개 행 */}
          {terms.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/dictionary/${item.term}`)}
              className="flex h-[40px] cursor-pointer hover:bg-gray-100 border-b border-[#d9d9d9]"
            >
              <div className="w-[200px] flex items-center justify-center">
                <p className="text-[15px] text-black">{item.term}</p>
              </div>
              <div className="flex-1 flex items-center px-[15px]">
                <p className="text-[15px] text-black truncate">{item.definition}</p>
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
