import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { demoDictionaryDetails } from '../data/demoData';

const imgSearch = "/assets/Search.png";

const DictionaryDetailContent = () => {
  const navigate = useNavigate();
  const { term } = useParams();
  const [selectedConsonant, setSelectedConsonant] = useState('ㄱ');

  // 용어 데이터 가져오기
  const termData = demoDictionaryDetails[term] || demoDictionaryDetails['공법'];

  const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  return (
    <>
      {/* 상단 구분선 */}
      <div className="bg-[#d9d9d9] h-[10px] w-full" />

      <div className="px-[30px] flex-1">
        {/* 뒤로가기 제목 */}
        <div className="py-[10px] h-[65px] flex items-center">
          <h1
            className="text-[30px] font-bold text-black cursor-pointer hover:text-gray-700"
            onClick={() => navigate('/dictionary')}
          >
            ←법률사전
          </h1>
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
        <div className="h-[65px] flex items-center justify-center px-[241.5px] py-[10px]">
          <div className="bg-[#d9d9d9] rounded-[10px] flex items-center justify-between px-[10px] w-[477px] h-[45px]">
            <input
              type="text"
              value={termData.term}
              placeholder="검색어를 입력 하세요!"
              className="w-[410px] text-[15px] text-black bg-transparent outline-none"
              readOnly
            />
            <div
              className="w-[35px] h-[35px] bg-center bg-cover bg-no-repeat cursor-pointer"
              style={{ backgroundImage: `url('${imgSearch}')` }}
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
