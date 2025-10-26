import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { demoDictionaryData } from '../data/demoDictionaryData';

const imgSearch = "/assets/Search.png";

const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 초성 추출 함수 (유니코드 기반)
const getInitialConsonant = (char) => {
  const code = char.charCodeAt(0) - 44032;
  if (code < 0 || code > 11171) return null;

  // 한글 초성 19개: ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ
  const allConsonants = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const consonantIndex = Math.floor(code / 588);
  const initialConsonant = allConsonants[consonantIndex];

  // 쌍자음 처리: ㄲ->ㄱ, ㄸ->ㄷ, ㅃ->ㅂ, ㅆ->ㅅ, ㅉ->ㅈ
  const doubleConsonantMap = {
    'ㄲ': 'ㄱ',
    'ㄸ': 'ㄷ',
    'ㅃ': 'ㅂ',
    'ㅆ': 'ㅅ',
    'ㅉ': 'ㅈ'
  };

  return doubleConsonantMap[initialConsonant] || initialConsonant;
};

// 메인 컨텐츠만 추출한 컴포넌트
export function DictionaryContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedConsonant, setSelectedConsonant] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [terms, setTerms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 15;

  // 페이지 이동 시 sessionStorage에서 복원
  useEffect(() => {
    // location.state가 없을 때만 sessionStorage에서 복원
    if (!location.state) {
      const savedConsonant = sessionStorage.getItem('dictionaryConsonant');
      const savedSearchQuery = sessionStorage.getItem('dictionarySearchQuery');

      if (savedConsonant) {
        setSelectedConsonant(savedConsonant);
      }
      if (savedSearchQuery) {
        setSearchQuery(savedSearchQuery);
      }
    }
  }, [location.pathname, location.state]);

  // location.state로 전달된 필터 적용 (우선순위 높음)
  useEffect(() => {
    if (location.state?.selectedConsonant !== undefined) {
      setSelectedConsonant(location.state.selectedConsonant);
    }
    if (location.state?.searchQuery !== undefined) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);

  // 필터 상태 변경 시 sessionStorage에 자동 저장
  useEffect(() => {
    sessionStorage.setItem('dictionaryConsonant', selectedConsonant);
  }, [selectedConsonant]);

  useEffect(() => {
    sessionStorage.setItem('dictionarySearchQuery', searchQuery);
  }, [searchQuery]);

  // 용어 데이터 필터링
  useEffect(() => {
    let filtered = [...demoDictionaryData];

    // 초성 필터링
    if (selectedConsonant !== '전체') {
      filtered = filtered.filter(term => {
        const firstChar = term.term.charAt(0);
        return getInitialConsonant(firstChar) === selectedConsonant;
      });
    }

    // 검색어 필터링 및 정렬
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(term =>
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query)
      );

      // 검색 결과 정렬: 용어명 일치 우선, 그 다음 내용 일치
      filtered.sort((a, b) => {
        const aTermMatch = a.term.toLowerCase().includes(query);
        const bTermMatch = b.term.toLowerCase().includes(query);

        // 둘 다 용어명 일치 또는 둘 다 내용만 일치하면 원래 순서 유지
        if (aTermMatch === bTermMatch) return 0;

        // a가 용어명 일치하면 우선
        if (aTermMatch) return -1;

        // b가 용어명 일치하면 b 우선
        return 1;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
  }, [selectedConsonant, searchQuery]);

  // 페이지네이션
  useEffect(() => {
    const total = Math.ceil(filteredData.length / itemsPerPage);
    setTotalPages(total);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setTerms(filteredData.slice(startIndex, endIndex));
  }, [filteredData, currentPage]);

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

  // 검색어 하이라이트 함수
  const highlightText = (text, query) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === query.trim().toLowerCase()) {
        return (
          <span key={index} className="bg-yellow-300">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <>
      <div className="px-[30px] flex-1">
        {/* 제목 */}
        <div className="py-[10px] h-[65px] flex items-center">
          <h1 className="text-[30px] font-bold text-black">용어사전</h1>
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
            <div className="w-[200px] min-w-[200px] max-w-[200px] flex items-center justify-center border-t-2 border-b-2 border-[#d9d9d9]">
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
          {terms.map((item, index) => (
            <div
              key={`${item.term}-${index}`}
              onClick={() => navigate(`/dictionary/${item.term}`, {
                state: {
                  previousConsonant: selectedConsonant,
                  previousSearchQuery: searchQuery
                }
              })}
              className="flex h-[40px] cursor-pointer hover:bg-gray-100 border-b border-[#d9d9d9]"
            >
              <div className="w-[200px] min-w-[200px] max-w-[200px] flex items-center justify-center">
                <p className="text-[15px] text-black">{highlightText(item.term, searchQuery)}</p>
              </div>
              <div className="flex-1 flex items-center px-[15px] overflow-hidden">
                <p className="text-[15px] text-black truncate w-full">{highlightText(item.definition, searchQuery)}</p>
              </div>
            </div>
          ))}
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

export default DictionaryContent;
