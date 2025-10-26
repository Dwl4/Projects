import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { demoDictionaryData } from '../data/demoDictionaryData';

const imgSearch = "/assets/Search.png";

const DictionaryDetailContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { term } = useParams();
  const [selectedConsonant, setSelectedConsonant] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  // 용어 데이터 가져오기
  const termData = demoDictionaryData.find(item => item.term === term) || demoDictionaryData[0];

  const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  // 이전 페이지에서 전달받은 필터 상태 저장
  const previousConsonant = location.state?.previousConsonant || '전체';
  const previousSearchQuery = location.state?.previousSearchQuery || '';

  // 자음 필터 버튼 클릭 핸들러
  const handleConsonantClick = (consonant) => {
    setSelectedConsonant(consonant);
    // 사전 목록 페이지로 이동하면서 자음 필터 상태 전달
    navigate('/dictionary', { state: { selectedConsonant: consonant } });
  };

  // 검색 핸들러
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 검색어와 함께 사전 목록 페이지로 이동
      navigate('/dictionary', { state: { searchQuery: searchQuery.trim() } });
    }
  };

  // Enter 키 핸들러
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="px-[30px] flex-1">
        {/* 뒤로가기 제목 */}
        <div className="py-[10px] h-[65px] flex items-center">
          <h1
            className="text-[30px] font-bold text-black cursor-pointer hover:text-gray-700"
            onClick={() => {
              // sessionStorage에 이전 필터 상태 저장 (브라우저 뒤로가기 대비)
              sessionStorage.setItem('dictionaryConsonant', previousConsonant);
              sessionStorage.setItem('dictionarySearchQuery', previousSearchQuery);
              // 사전 목록 페이지로 이동 (history 교체)
              navigate('/dictionary', { replace: true });
            }}
          >
            ←용어사전
          </h1>
        </div>

        {/* 초성 필터 */}
        <div className="h-[50px] flex items-center justify-center gap-[10px] px-[205px]">
          {/* 전체 버튼 */}
          <button
            onClick={() => handleConsonantClick('전체')}
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
              onClick={() => handleConsonantClick(consonant)}
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
        <div className="h-[65px] flex items-center justify-center px-[241.5px] py-[10px]">
          <div className="bg-[#d9d9d9] rounded-[10px] flex items-center justify-between px-[10px] w-[477px] h-[45px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="검색어를 입력 하세요!"
              className="w-[410px] text-[15px] text-black bg-transparent outline-none placeholder-[#787878]"
            />
            <div
              className="w-[35px] h-[35px] bg-center bg-cover bg-no-repeat cursor-pointer"
              style={{ backgroundImage: `url('${imgSearch}')` }}
              onClick={handleSearch}
            />
          </div>
        </div>

        {/* 용어 설명 박스 */}
        <div className="px-[10px] py-[10px] h-[800px]">
          {/* 용어 제목 박스 */}
          <div className="px-[30px] py-[10px] h-[78px] flex items-center">
            <h2 className="text-[25px] font-bold text-black px-[10px] py-[10px]">
              {termData.term}
            </h2>
          </div>

          {/* 용어 설명 내용 */}
          <div className="px-[20px] py-[20px] h-[109px]">
            <p className="text-[15px] text-black leading-[1.5]">
              {termData.definition}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DictionaryDetailContent;
