import React, { useState } from 'react';
import { demoLawyerProfiles } from '../data/demoData';

const imgLawIcon = "/assets/law-icon.png";
const imgLawHammer = "/assets/law-hammer.png";
const imgLawyer = "/assets/Lawyer.png";
const imgMagnifyingLens = "/assets/Search.png";
const imgFavorite = "/assets/favorite.png";

function SearchResultsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLawyerList, setShowLawyerList] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const userQuestion = "3달 전에 일했던 가게에서 사장님이 알바비를 3달째 안주고 있어 달라고 했더니 연락을 안보고 전화를 하니까 그냥 끊어 버렸어 난 사장님을 고소 하고 싶어";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('검색:', searchQuery);
    }
  };

  const toggleFavorite = (lawyerId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(lawyerId)) {
        newFavorites.delete(lawyerId);
      } else {
        newFavorites.add(lawyerId);
      }
      return newFavorites;
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full">

      {/* 메인 컨텐츠 */}
      <div className="px-[60px] pt-[10px] py-[50px]">
        {/* 검색 키워드 */}
        <div className="mb-[30px]">
          <p className="text-[14px] text-center text-[#999]">이 서비스는 법률 자문이 아닌 단순 참고용입니다</p>
          <h1 className="text-[24px] font-bold"># 사건1</h1>
        </div>

        {/* 사용자 질문 */}
        <div className="mb-[40px] flex justify-end">
          <div className="bg-[#ACCEE9] rounded-[10px] px-[20px] py-[15px] max-w-[500px]">
            <p className="text-[14px] text-[#082135] leading-relaxed">
              {userQuestion}
            </p>
          </div>
        </div>

        {/* 답변 섹션 */}
        <div className="mb-[40px]">
          <h2 className="text-[20px] font-bold mb-[20px]">임금체불은 형사처벌 대상입니다.</h2>
          <p className="text-[15px] text-[#333] mb-[30px] leading-relaxed">
            사장님이 알바비를 고의로 주지 않고 있다면, 근로기준법 제36조, 제109조 위반으로 **형사처벌(벌금 또는 징역)**이 가능합니다.
          </p>

          {/* 관련 법령 */}
          <div className="space-y-[20px]">
            <div className="flex items-start gap-[15px]">
              <div className="w-[40px] h-[40px] bg-white items-center justify-center flex-shrink-0">
                <img src={imgLawIcon} alt="법령" className="w-[32px] h-[40px]" />
              </div>
              <div>
                <div className="flex items-center gap-[10px] mb-[10px]">
                  <span className="text-[16px] text-[#5F9AD0] font-bold">관련 법령</span>
                  <span className="text-[10px] font-bold text-[#767676] bg-[#D9D9D9] px-[7px] py-[2px] rounded">더보기</span>
                </div>
                <div className="mb-[15px]">
                  <p className="text-[14px] font-bold mb-[[2px]">근로기준법 제36조 (금품 청산)</p>
                  <p className="text-[14px] text-[#555] leading-relaxed">
                    사용자는 근로자가 사망 또는 퇴직한 경우에는 그 지급 사유가 발생한 때부터 14일 이내에 임금, 보상금, 그 밖의 일체의 금품을 지급하여야 한다. 다만, 특별한 사정이 있을 경우에는 당사자 간의 합의에 따라 지급 기일을 연장할 수 있습니다.
                  </p>
                </div>
                <div>
                  <p className="text-[14px] font-bold mb-[[2px]">근로기준법 제109조 (벌칙)</p>
                  <p className="text-[14px] text-[#555] leading-relaxed">
                    제36조, 제42조, 제43조, 제45조, 제55조, 제63조 또는 제70조의 규정을 위반한 자는 3년 이하의 징역 또는 2,000만 원 이하의 벌금에 처한다.
                  </p>
                </div>
              </div>
            </div>

            {/* 관련 판례 */}
            <div className="flex items-start gap-[15px]">
              <div className="w-[60px] h-[37px] bg-white items-center justify-center flex-shrink-0">
                <img src={imgLawHammer} alt="판례" className="w-[60px] h-[37px]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-[10px] mb-[10px]">
                  <span className="text-[16px] text-[#5F9AD0] font-bold">관련 판례</span>
                  <span className="text-[10px] font-bold text-[#767676] bg-[#D9D9D9] px-[7px] py-[2px] rounded">더보기</span>
                </div>
                <div className="mb-[15px]">
                  <p className="text-[15px] font-bold mb-[10px]">대법원 1994. 10. 28. 선고 94다26615 판결</p>
                  <ul className="text-[14px] text-[#555] space-y-[[2px]">
                    <li>• 사건명: 체불임금</li>
                    <li>• 판시사항: 근로기준법상 통상임금의 정의 및 가족수당, 근속수당의 통상임금 포함 여부</li>
                    <li>• 판결요지: 근로자에게 정기적·일률적으로 지급되는 고정급은 통상임금에 해당하며, 가족수당 및 근속수당은 통상임금에 포함되지 않는다.</li>
                  </ul>
                </div>
                <div className="space-y-[15px]">
                  <div>
                    <p className="text-[14px] font-bold mb-[5px]">대법원 1992. 7. 14. 선고 91다5501 판결</p>
                    <ul className="text-[14px] text-[#555] space-y-[2px]">
                      <li>• 사건명: 체불임금</li>
                      <li>• 판시사항: 미혼자 등 가족이 없는 근로자에게도 일률적으로 지급되는 가족수당의 통상임금 포함 여부</li>
                      <li>• 판결요지: 가족이 없는 근로자에게도 일률적으로 지급되는 가족수당은 통상임금에 해당한다.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold mb-[5px]">대법원 2001. 2. 23. 선고 2001도204 판결</p>
                    <ul className="text-[14px] text-[#555] space-y-[2px]">
                      <li>• 사건명: 근로기준법위반</li>
                      <li>• 판시사항: 임금이나 퇴직금을 지급할 수 없는 불가피한 사정이 인정되는 경우, 근로기준법 위반범죄의 책임조각사유가 되는지 여부</li>
                      <li>• 판결요지: 사용자가 모든 성의와 노력을 다했음에도 불가피한 사정으로 임금을 지급하지 못한 경우에는 책임이 조각될 수 있다.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 대응방법 */}
          <div className="mt-[40px]">
            <h3 className="text-[16px] font-bold mb-[2px]">대응방법(참고)</h3>
            <div className="space-y-[2px] text-[14px] text-[#555]">
              <p>1. 내용증명 발송: 사장님에게 임금 지급을 요구하는 내용증명을 보내세요.</p>
              <p>2. 고용노동부 진정: 관할 고용노동지청에 임금 체불에 대한 진정을 제기할 수 있습니다.</p>
              <p>3. 민사소송 제기: 임금 청구를 위한 민사소송을 제기할 수 있습니다.</p>
              <p>4. 형사 고소: 근로기준법 위반으로 형사 고소를 진행할 수 있습니다.​</p>
            </div>
          </div>

          {/* 변호사 시스템 버튼 */}
          <div className="mt-[40px] flex justify-center">
            <button
              onClick={() => setShowLawyerList(!showLawyerList)}
              className="w-[200px] h-[40px] bg-white border-2 border-[#9EC3E5] flex items-center justify-center gap-[10px] shadow-md hover:bg-gray-50 transition-colors"
            >
              <img src={imgLawyer} alt="변호사" className="w-[24px] h-[24px] object-contain" />
              <span className="text-[14px] text-black">
                {showLawyerList ? '리스트 가리기' : '관련 변호사 리스트 보기'}
              </span>
            </button>
          </div>
        </div>

        {/* 변호사 리스트 섹션 */}
        {showLawyerList && (
          <div className="mt-[60px] px-[20px] pb-[50px]">
            <h2 className="text-[24px] font-bold text-black mb-[30px]">관련 변호사 리스트</h2>
            <div
              className="flex gap-[35px] overflow-x-auto pb-[20px] cursor-grab active:cursor-grabbing select-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {demoLawyerProfiles.map((lawyer) => (
                <div key={lawyer.id} className="bg-[#d9d9d9] flex flex-col gap-[10px] h-[500px] items-start px-[10px] py-[15px] rounded-[10px] w-[250px]">
                  {/* 이미지와 소개 */}
                  <div className="flex items-start justify-between w-full">
                    {/* 소개글 */}
                    <div className="flex flex-col items-start self-stretch">
                      <div className="font-normal text-[11px] text-black w-[100px] h-[160px] leading-normal overflow-hidden">
                        {lawyer.introduction}
                      </div>
                    </div>
                    {/* 이미지 */}
                    <div className="h-[160px] overflow-hidden relative w-[120px]">
                      <div className="absolute left-0 top-0">
                        <div
                          className="absolute bg-center bg-cover bg-no-repeat h-[160px] w-[120px] rounded-[5px] top-0"
                          style={{
                            backgroundImage: `url('${lawyer.image}')`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 변호사 이름 */}
                  <div className="flex gap-[10px] items-center justify-end px-[20px] text-black w-full">
                    <div className="font-normal text-[11px]">변호사</div>
                    <div className="font-bold text-[15px]">{lawyer.name}</div>
                  </div>

                  {/* 전문분야 */}
                  <div className="flex flex-col gap-[10px] items-start justify-center w-full">
                    <div className="flex items-center">
                      <div className="font-bold text-[12px] text-black">전문 분야</div>
                    </div>

                    <div className="font-normal grid grid-cols-2 gap-y-[5px] text-[10px] w-full">
                      {lawyer.specialties.map((spec, idx) => (
                        <div key={idx} className="text-black w-[110px]">
                          <ul className="list-disc ml-[15px]">
                            <li>{spec}</li>
                          </ul>
                        </div>
                      ))}
                      <div className="text-[#787878] w-[110px] pl-[20px]">
                        외 {lawyer.specialtyCount}개
                      </div>
                    </div>
                  </div>

                  {/* 주요 경력 */}
                  <div className="flex flex-col gap-[10px] items-start w-full">
                    <div className="flex items-center">
                      <div className="font-bold text-[12px] text-black">주요 경력</div>
                    </div>
                    <div className="flex flex-col font-normal gap-[5px] items-start text-[10px] w-[230px]">
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
                  <div className="flex flex-col gap-[10px] items-start w-full">
                    <div className="flex items-center">
                      <div className="font-bold text-[12px] text-black">활동 지역</div>
                    </div>
                    <div className="flex flex-col gap-[5px] items-start w-[230px]">
                      <div className="font-normal text-[10px] text-black">
                        <ul className="list-disc ml-[15px]">
                          <li>서울·경기·온라인 상담 가능</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 즐겨찾기 및 상담하기 버튼 */}
                  <div className="flex grow items-center justify-between pl-[10px] w-full min-h-0">
                    <button
                      onClick={() => toggleFavorite(lawyer.id)}
                      className="size-[25px] bg-center bg-cover bg-no-repeat cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundImage: `url('${imgFavorite}')`,
                        filter: favorites.has(lawyer.id) ? 'none' : 'grayscale(100%)'
                      }}
                    />
                    <div className="font-bold text-[10px] text-black cursor-pointer hover:underline">
                      상담하러 가기 →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* 하단 검색창 */}
        <section className="flex justify-center pb-[50px] mt-[60px]">
          <div className="relative">
            <div className="w-[585px] h-[50px] bg-[#d9d9d9] relative">
              <div className="w-[585px] h-[50px] bg-[#d9d9d9] shadow-[5px_6px_0px_#95b1d4]" />

              {/* 입력창 */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="궁금한 사항을 물어봐 주세요!"
                className="absolute left-[16px] top-1/2 transform -translate-y-1/2
                           w-[520px] h-[35px] bg-transparent outline-none text-[16px] text-[#333]"
              />

              {/* 돋보기 아이콘 */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div
                  className="w-10 h-10 bg-center bg-cover bg-no-repeat cursor-pointer hover:opacity-80"
                  style={{ backgroundImage: `url('${imgMagnifyingLens}')` }}
                  onClick={handleSearch}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SearchResultsContent;
