import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoDictionaryData } from '../data/demoData';

const imgSearch = "/assets/Search.png";

const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

// 메인 컨텐츠만 추출한 컴포넌트
export function DictionaryContent() {
  const navigate = useNavigate();
  const [selectedConsonant, setSelectedConsonant] = useState('ㄱ');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageGroup, setCurrentPageGroup] = useState(0);

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

  return (
    <>
      <div className="px-[30px] flex-1">
        {/* 제목 */}
        <div className="py-[10px] h-[65px] flex items-center">
          <h1 className="text-[30px] font-bold text-black">법률사전</h1>
        </div>

        {/* 초성 필터 */}
        <div className="h-[50px] flex items-center justify-center gap-[10px] px-[205px]">
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

          {/* 내용 - 15개 행 */}
          {demoDictionaryData.map((item, index) => (
            <div
              key={index}
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
            <button
              onClick={handlePrevious}
              className={`w-[40px] h-[25px] flex items-center justify-center text-[10px] font-medium text-black ${
                currentPageGroup > 0 ? 'cursor-pointer' : 'invisible'
              }`}
            >
              이전
            </button>
            <div className="flex items-center justify-between w-[200px] h-[15px] text-[10px] text-black font-medium gap-[13.875px]">
              {getPageNumbers().map((page, index) => (
                <button
                  key={page}
                  className={`${page === 11 ? 'underline font-bold' : ''} hover:underline transition-all`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-[40px] h-[25px] flex items-center justify-center text-[10px] font-medium text-black cursor-pointer"
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
