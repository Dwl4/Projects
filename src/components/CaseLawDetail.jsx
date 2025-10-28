import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCaseLawFromGov } from '../api/caseLawService';

// HTML 태그 제거 및 텍스트 정리 함수
const cleanHtmlText = (text) => {
  if (!text) return text;

  return text
    .replace(/<br\s*\/?>/gi, '\n')  // <br>, <br/>, <br /> 를 줄바꿈으로
    .replace(/<p>/gi, '\n')          // <p> 태그를 줄바꿈으로
    .replace(/<\/p>/gi, '\n')        // </p> 태그를 줄바꿈으로
    .replace(/<[^>]+>/g, '')         // 나머지 모든 HTML 태그 제거
    .replace(/\n\s*\n/g, '\n\n')     // 연속된 빈 줄을 하나로
    .trim();                          // 앞뒤 공백 제거
};

export default function CaseLawDetail() {
  const [activeTab, setActiveTab] = useState('판시사항');
  const [caseLawData, setCaseLawData] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const receivedData = location.state?.caseLawData;

  const tabs = ['판시사항', '판결요지', '참조조문', '참조판례', '전문'];

  useEffect(() => {
    const fetchDetailData = async () => {
      if (!receivedData) {
        navigate('/case-law');
        return;
      }

      // 먼저 검색 결과의 기본 정보를 표시
      const basicData = {
        title: receivedData.title || receivedData.case_name || '판례명 없음',
        subtitle: receivedData.subtitle ||
                  `${receivedData.court_name || ''} ${receivedData.judgment_date || ''} ${receivedData.case_number || ''}`.trim(),
        판시사항: '본문 로딩 중...',
        판결요지: '본문 로딩 중...',
        참조조문: '본문 로딩 중...',
        참조판례: '본문 로딩 중...',
        전문: '본문 로딩 중...'
      };
      setCaseLawData(basicData);

      // 상세 본문 가져오기 (국가법령정보 API)
      try {
        const caseLawId = receivedData.caseLawId || receivedData.case_law_id;

        if (caseLawId) {
          const detailData = await getCaseLawFromGov(caseLawId);

          if (detailData && detailData.PrecService) {
            const precData = detailData.PrecService;

            const fullData = {
              title: precData.사건명 || basicData.title,
              subtitle: `${precData.법원명 || ''} ${precData.선고일자 || ''} ${precData.사건번호 || ''} ${precData.선고 || ''}`.trim() || basicData.subtitle,
              판시사항: cleanHtmlText(precData.판시사항) || '판시사항 정보가 없습니다.',
              판결요지: cleanHtmlText(precData.판결요지) || '판결요지 정보가 없습니다.',
              참조조문: cleanHtmlText(precData.참조조문) || '참조조문 정보가 없습니다.',
              참조판례: cleanHtmlText(precData.참조판례) || '참조판례 정보가 없습니다.',
              전문: cleanHtmlText(precData.판례내용) || '전문 정보가 없습니다.'
            };

            setCaseLawData(fullData);
          } else {
            // JSON 데이터가 없는 경우
            setCaseLawData({
              ...basicData,
              판시사항: receivedData.content || receivedData.case_name || '판시사항 정보가 없습니다.',
              판결요지: '본문 정보는 국가법령정보센터에서 확인하실 수 있습니다.',
              참조조문: '본문 정보는 국가법령정보센터에서 확인하실 수 있습니다.',
              참조판례: '본문 정보는 국가법령정보센터에서 확인하실 수 있습니다.',
              전문: '본문 정보는 국가법령정보센터에서 확인하실 수 있습니다.'
            });
          }
        }
      } catch (error) {
        console.error('판례 본문 로딩 실패:', error);
        // 에러 발생 시 JSON 데이터 없음으로 처리
        setCaseLawData({
          ...basicData,
          판시사항: receivedData.content || receivedData.case_name || '판시사항 정보가 없습니다.',
          판결요지: '본문 정보는 국가법령정보센터에서 확인하실 수 있습니다.',
          참조조문: '본문 정보는 국가법령정보센터에서 확인하실 수 있습니다.',
          참조판례: '본문 정보는 국가법령정보센터에서 확인하실 수 있습니다.',
          전문: '본문 정보는 국가법령정보센터에서 확인하실 수 있습니다.'
        });
      }
    };

    fetchDetailData();
  }, [receivedData, navigate]);

  // caseLawData가 null이면 로딩 표시
  if (!caseLawData) {
    return (
      <div className="bg-white flex flex-col min-h-screen w-full items-center justify-center">
        <p className="text-[20px] text-black">판례 정보를 불러오는 중...</p>
      </div>
    );
  }

  const handleBack = () => {
    navigate('/case-law');
  };

  return (
    <div className="bg-white flex flex-col w-full overflow-x-hidden">
      {/* 메인 컨텐츠 */}
      <div className="flex w-full">
        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col mx-auto max-w-[1020px] w-full pb-[50px]">

          <div className="px-[30px] py-[10px] w-full">
            {/* 뒤로가기 & 외부 링크 버튼 */}
            <div className="py-[10px] flex justify-between items-center gap-[10px]">
              <p
                className="text-[30px] font-bold text-black cursor-pointer hover:text-[#08213b] flex-shrink-0"
                onClick={handleBack}
              >
                ←판례
              </p>
              <a
                href={`http://www.law.go.kr/DRF/lawService.do?OC=${process.env.REACT_APP_LAW_API_OC || ''}&target=prec&ID=${receivedData?.caseLawId || receivedData?.case_law_id || ''}&type=HTML`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[6px] bg-gradient-to-r from-[#08213b] to-[#0a3d5f] text-white px-[16px] py-[8px] rounded-[8px] text-[13px] font-semibold shadow-md hover:shadow-lg hover:from-[#0a2d4f] hover:to-[#0c4d7a] transition-all duration-300 transform hover:scale-105 flex-shrink-0 whitespace-nowrap"
              >
                <svg className="w-[14px] h-[14px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>법령정보센터 전문 보기</span>
              </a>
            </div>

            {/* 판례 제목 */}
            <div className="bg-[#9ec3e5] px-[30px] py-[15px] flex flex-col gap-[5px] w-full overflow-hidden">
              <p className="text-[20px] font-bold text-[#08213b] break-words">
                {caseLawData?.title || '판례명 없음'}
              </p>
              <p className="text-[13px] text-black break-words">
                {caseLawData?.subtitle || ''}
              </p>
            </div>

            {/* 탭 메뉴 */}
            <div className="flex w-full overflow-x-auto">
              {tabs.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[120px] h-[40px] flex items-center justify-center cursor-pointer ${
                    activeTab === tab ? 'bg-[#9ec3e5] font-bold' : 'bg-white'
                  }`}
                >
                  <p className="text-[15px] text-black">{tab}</p>
                </div>
              ))}
            </div>

            {/* 탭 콘텐츠 */}
            <div className="bg-white px-[10px] py-[30px] w-full">
              {activeTab === '판시사항' && (
                <div className="text-[13px] text-black leading-[1.5] whitespace-pre-wrap break-words w-full">
                  {caseLawData?.판시사항 || '판시사항 정보가 없습니다.'}
                </div>
              )}

              {activeTab === '판결요지' && (
                <div className="text-[13px] text-black leading-[1.5] whitespace-pre-wrap break-words w-full">
                  {caseLawData?.판결요지 || '판결요지 정보가 없습니다.'}
                </div>
              )}

              {activeTab === '참조조문' && (
                <div className="text-[13px] text-black leading-[1.5] whitespace-pre-wrap break-words w-full">
                  {caseLawData?.참조조문 || '참조조문 정보가 없습니다.'}
                </div>
              )}

              {activeTab === '참조판례' && (
                <div className="text-[13px] text-black leading-[1.5] whitespace-pre-wrap break-words w-full">
                  {caseLawData?.참조판례 || '참조판례 정보가 없습니다.'}
                </div>
              )}

              {activeTab === '전문' && (
                <div className="text-[13px] text-black leading-[1.5] whitespace-pre-wrap break-words w-full">
                  {caseLawData?.전문 || '전문 정보가 없습니다.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
