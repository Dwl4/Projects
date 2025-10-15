import React, { useState } from 'react';
import { demoLawyerProfiles } from '../data/demoData';

const LawyerListContent = () => {
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <>
      {/* 상단 구분선 */}
      <div className="w-full h-[10px] bg-[#d9d9d9]" />

      {/* 메인 컨텐츠 */}
      <div className="w-full px-[20px] py-[10px]">
        {/* 안내 문구 */}
        <div className="w-full flex justify-center py-[20px]">
          <p className="text-[16px] font-normal text-center">
            본 플랫폼은 변호사 소개 또는 알선을 목적으로 하지 않으며, 변호사 노출 순서는 랜덤 방식으로 운영됩니다.
          </p>
        </div>

        {/* 검색 영역 */}
        <div className="w-full flex items-center justify-center gap-[30px] py-[20px]">
          <span className="text-[16px] font-normal">키워드 검색</span>
          <div className="relative w-[477px]">
            <input
              type="text"
              placeholder="전문 분야, 변호사 성함 등을 입력해주세요."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full h-[45px] px-[10px] border-[1px] border-gray-300 rounded-[5px] text-[14px]"
            />
            <button className="absolute right-[5px] top-[5px] w-[35px] h-[35px]">
              <img src="/assets/search_icon.svg" alt="검색" className="w-full h-full" />
            </button>
          </div>
        </div>

        {/* 변호사 카드 그리드 */}
        <div className="w-full px-[10px] py-[20px]">
          <div className="grid grid-cols-3 gap-x-[35px] gap-y-[35px]">
            {demoLawyerProfiles.map((lawyer) => (
              <div
                key={lawyer.id}
                className="bg-[#d9d9d9] rounded-[10px] p-[10px] flex flex-col gap-[10px] cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* 이미지와 소개 */}
                <div className="flex gap-[10px] h-[160px]">
                  {/* 짧은 소개 */}
                  <div className="w-[120px] h-full overflow-hidden">
                    <p className="text-[11px] font-normal leading-[13px] break-words">
                      {lawyer.introduction}
                    </p>
                  </div>

                  {/* 이미지 */}
                  <div className="w-[120px] h-full overflow-hidden rounded-[5px]">
                    <img
                      src={lawyer.image}
                      alt={lawyer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 변호사 이름 */}
                <div className="flex items-center justify-end gap-[10px] px-[10px]">
                  <span className="text-[11px] font-normal">변호사</span>
                  <span className="text-[15px] font-bold">{lawyer.name}</span>
                </div>

                {/* 전문 분야 */}
                <div className="flex flex-col gap-[10px]">
                  <div className="text-[12px] font-bold">전문 분야</div>
                  <div className="grid grid-cols-2 gap-y-[5px] text-[10px]">
                    {lawyer.specialties.slice(0, 3).map((spec, idx) => (
                      <div key={idx} className="text-black">
                        <ul className="list-disc ml-[15px]">
                          <li>{spec}</li>
                        </ul>
                      </div>
                    ))}
                    <div className="text-[#787878] pl-[20px]">
                      외 {lawyer.specialtyCount}개
                    </div>
                  </div>
                </div>

                {/* 주요 경력 */}
                <div className="flex flex-col gap-[10px]">
                  <div className="text-[12px] font-bold">주요 경력</div>
                  <div className="flex flex-col gap-[5px] text-[10px]">
                    {lawyer.experience.map((exp, idx) => (
                      <div key={idx} className="text-black">
                        <ul className="list-disc ml-[15px]">
                          <li>{exp}</li>
                        </ul>
                      </div>
                    ))}
                    <div className="text-[#787878] pl-[20px]">외 5개</div>
                  </div>
                </div>

                {/* 활동 지역 */}
                <div className="flex flex-col gap-[10px]">
                  <div className="text-[12px] font-bold">활동 지역</div>
                  <div className="text-[10px]">
                    <ul className="list-disc ml-[15px]">
                      <li>{lawyer.region}</li>
                    </ul>
                  </div>
                </div>

                {/* 상담하기 */}
                <div className="flex items-center justify-between px-[10px] pt-[5px]">
                  <img src="/assets/favorite.png" alt="즐겨찾기" className="w-[25px] h-[25px]" />
                  <span className="text-[10px] font-bold cursor-pointer hover:underline">
                    상담하러 가기 →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LawyerListContent;
