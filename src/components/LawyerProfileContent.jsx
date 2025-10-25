import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lawyerService } from '../api';

const LawyerProfileContent = () => {
  const navigate = useNavigate();
  const [lawyerData, setLawyerData] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const fetchLawyerProfile = async () => {
      try {
        console.log('🔍 변호사 프로필 조회 (보기 모드)...');

        // API로 변호사 정보 조회
        const userData = await lawyerService.getCurrentLawyer();

        console.log('✅ 변호사 프로필 조회 성공:', userData);

        setLawyerData(userData);

        // 프로필 이미지 URL 설정
        if (userData.profile_image) {
          const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://54.180.238.189:8001/api/v1';
          const baseUrl = API_BASE.replace('/api/v1', '');
          setProfileImageUrl(userData.profile_image.startsWith('http') ? userData.profile_image : `${baseUrl}${userData.profile_image}`);
        }

        // localStorage에도 저장
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } catch (error) {
        console.error('❌ 변호사 프로필 조회 실패:', error);

        // 에러 발생 시 localStorage에서 로드 시도
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          console.log('📦 localStorage에서 프로필 로드');
          const userData = JSON.parse(currentUser);
          setLawyerData(userData);
        }
      }
    };

    fetchLawyerProfile();
  }, []);

  return (
    <>
      <div className="px-[50px] py-[10px] flex-1">
        {/* 환영 문구 */}
        <div className="py-[30px] h-[100px]">
          <div className="h-[60px] flex items-center">
            <span className="text-[40px] font-bold text-black">{lawyerData?.name || '변호사'}</span>
            <span className="text-[40px] font-medium text-black ml-[10px]">변호사님 환영합니다!</span>
          </div>
          <div className="h-[30px] flex items-center mt-[10px]">
            <span className="text-[20px] text-black">사용자님에게</span>
            <span className="text-[20px] font-bold text-black ml-[5px]">{lawyerData?.name || '변호사'}</span>
            <span className="text-[20px] text-black ml-[5px]">변호사님을 소개해 보세요.</span>
          </div>
        </div>

        {/* 구분선과 수정하기 버튼 */}
        <div className="h-[70px] relative">
          {/* 검은색 구분선 */}
          <div className="absolute left-[60px] top-[24px] w-[784px] h-[1px] bg-black mt-[20px]" />
          {/* 수정하기 버튼 - 오른쪽 끝, 줄 위에 배치 */}
          <button
            className="absolute right-[76px] top-[10px] flex items-center justify-center gap-[5px] px-[20px] h-[36px] mt-[20px] cursor-pointer bg-white border-2 border-[#9ec3e5] hover:bg-[#f0f8ff] active:bg-[#e6f3ff] rounded-[8px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.15)] transition-all duration-200 z-10"
            onClick={() => navigate('/lawyer-profile-edit')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 2L14 4.5L5 13.5H2.5V11L11.5 2Z" stroke="#9ec3e5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.5 4L12 6.5" stroke="#9ec3e5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[15px] font-bold text-[#9ec3e5]">수정하기</span>
          </button>
        </div>

        {/* 프로필 박스 */}
        <div className="h-[419px] flex gap-[10px] py-[10px]">
          {/* 이미지 */}
          <div className="w-[300px] h-[399px] overflow-hidden">
            <img
              src={profileImageUrl || '/assets/lawyer-pic.png'}
              alt={lawyerData?.name || '변호사'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 소개 및 연락처 */}
          <div className="flex-1 flex flex-col px-[20px]">
            {/* 소개 텍스트 */}
            <div className="h-auto py-[10px]">
              <div className="w-full h-[270px] text-[15px] text-[#6b6b6b] font-bold leading-[normal] border-[3px] border-[#d9d9d9] p-[10px] whitespace-pre-line overflow-y-auto">
                {lawyerData?.introduction || `변호사님, 상담 가능 시간과 간단한 소개글을 입력해주세요.

상담 가능 시간:
     예: 평일 10:00 ~ 18:00 / 점심시간 12:00~13:00 제외


자기소개글:
     예: 노동법 및 임대차 분야에서 10년간 실무 경험을 쌓았습니다.
           의뢰인의 입장에서 현실적인 해결책을 제시드리는 상담을 지향합니다.`}
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="h-[119px] pt-[10px] flex gap-[30px]">
              {/* 이름, 연락처 */}
              <div className="flex gap-[5px] text-[17px]">
                <div className="flex flex-col gap-[21px] font-bold text-black whitespace-nowrap">
                  <div>이름:</div>
                  <div>연락처:</div>
                </div>
                <div className="flex flex-col gap-[21px] text-[#6b6b6b] font-bold">
                  <div>{lawyerData?.name || '-'}</div>
                  <div>{lawyerData?.phone || '-'}</div>
                </div>
              </div>

              {/* 이메일, 주소 */}
              <div className="flex gap-[5px] text-[17px]">
                <div className="flex flex-col gap-[21px] font-bold text-black whitespace-nowrap">
                  <div>이메일:</div>
                  <div>주소:</div>
                </div>
                <div className="flex flex-col gap-[21px] text-[#6b6b6b] font-bold">
                  <div>{lawyerData?.email || '-'}</div>
                  <div className="leading-[1.5] max-w-[230px]">
                    {lawyerData?.address || '-'}
                    {lawyerData?.detailed_address && ` ${lawyerData.detailed_address}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 파란색 구분선 */}
        <div className="h-[35px] flex items-center">
          <div className="w-full h-[5px] bg-[#9ec3e5]" />
        </div>

        {/* 전문 분야 */}
        <div className="py-[10px]">
          <h3 className="text-[16px] font-bold text-black mb-[10px] pl-[20px]">전문 분야</h3>
          <div className="flex flex-wrap gap-[13px] pl-[20px]">
            {lawyerData?.specialties && lawyerData.specialties.length > 0 ? (
              lawyerData.specialties.map((specialty, idx) => (
                <div
                  key={idx}
                  className="border-[3px] border-[#9ec3e5] rounded-[30px] px-[10px] py-[3px] bg-white"
                >
                  <span className="text-[15px] font-bold text-black">{specialty}</span>
                </div>
              ))
            ) : (
              <span className="text-[14px] text-[#999]">전문 분야를 추가해주세요.</span>
            )}
          </div>
        </div>

        {/* 회색 구분선 */}
        <div className="h-[66px] flex items-center px-[50px]">
          <div className="w-[820px] h-[1px] bg-[#787878]" />
        </div>

        {/* 학력 및 경력 */}
        <div className="flex gap-[110px] px-[91px]">
          {/* 학력 */}
          <div className="w-[432px]">
            <h3 className="text-[16px] font-bold text-black mb-[10px] pl-[10px]">학력:</h3>
            <div className="space-y-[10px]">
              {lawyerData?.education && lawyerData.education.length > 0 ? (
                lawyerData.education.map((edu, idx) => (
                  <div key={idx} className="flex items-center pl-[10px]">
                    <span className="text-[16px] font-bold text-[#6B6B6B] pl-[15px]">
                      · {edu.school} {edu.major} {edu.degree}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center pl-[10px]">
                  <span className="text-[14px] text-[#999] pl-[15px]">학력 정보를 추가해주세요.</span>
                </div>
              )}
            </div>
          </div>

          {/* 경력 */}
          <div className="w-[296px]">
            <h3 className="text-[16px] font-bold text-black mb-[10px] pl-[10px]">경력:</h3>
            <div className="space-y-[10px]">
              {lawyerData?.career && lawyerData.career.length > 0 ? (
                lawyerData.career.map((car, idx) => (
                  <div key={idx} className="flex items-center pl-[10px]">
                    <span className="text-[16px] font-bold text-[#6B6B6B] pl-[15px]">
                      · {car.company} {car.position} ({car.years}년)
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center pl-[10px]">
                  <span className="text-[14px] text-[#999] pl-[15px]">경력 정보를 추가해주세요.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LawyerProfileContent;
