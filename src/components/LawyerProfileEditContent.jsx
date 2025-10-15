import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoLawyerProfileDetail } from '../data/demoData';

const LawyerProfileEditContent = () => {
  const navigate = useNavigate();
  const [lawyerData, setLawyerData] = useState(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    lawFirm: '',
    lawyerRegistrationNumber: '',
    introduction: '',
    specialties: [],
    education: [],
    career: [],
  });

  // 이미지 경로
  const imgLawyerPic = "/assets/lawyer-pic.png";

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    const storedUserName = localStorage.getItem('userName');
    const currentUser = localStorage.getItem('currentUser');

    if (loginStatus === 'true') {
      // currentUser 데이터 로드 및 폼 초기화
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        setLawyerData(userData);

        // 폼 데이터 초기화
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          email: userData.email || '',
          address: userData.address || '',
          lawFirm: userData.lawFirm || '',
          lawyerRegistrationNumber: userData.lawyerRegistrationNumber || '',
          introduction: userData.introduction || demoLawyerProfileDetail.introduction,
          specialties: userData.specialties || demoLawyerProfileDetail.specialties,
          education: userData.education || demoLawyerProfileDetail.education,
          career: userData.experience || demoLawyerProfileDetail.career,
        });
      }
    } else if (currentUser) {
      const userData = JSON.parse(currentUser);
      setLawyerData(userData);

      // 폼 데이터 초기화
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        email: userData.email || '',
        address: userData.address || '',
        lawFirm: userData.lawFirm || '',
        lawyerRegistrationNumber: userData.lawyerRegistrationNumber || '',
        introduction: userData.introduction || demoLawyerProfileDetail.introduction,
        specialties: userData.specialties || demoLawyerProfileDetail.specialties,
        education: userData.education || demoLawyerProfileDetail.education,
        career: userData.experience || demoLawyerProfileDetail.career,
      });

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', userData.nickname);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecialtyAdd = () => {
    setFormData(prev => ({
      ...prev,
      specialties: [...prev.specialties, '']
    }));
  };

  const handleSpecialtyChange = (index, value) => {
    const newSpecialties = [...formData.specialties];
    newSpecialties[index] = value;
    setFormData(prev => ({
      ...prev,
      specialties: newSpecialties
    }));
  };

  const handleSpecialtyRemove = (index) => {
    const newSpecialties = formData.specialties.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      specialties: newSpecialties
    }));
  };

  const handleEducationAdd = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, '']
    }));
  };

  const handleEducationChange = (index, value) => {
    const newEducation = [...formData.education];
    newEducation[index] = value;
    setFormData(prev => ({
      ...prev,
      education: newEducation
    }));
  };

  const handleCareerAdd = () => {
    setFormData(prev => ({
      ...prev,
      career: [...prev.career, '']
    }));
  };

  const handleCareerChange = (index, value) => {
    const newCareer = [...formData.career];
    newCareer[index] = value;
    setFormData(prev => ({
      ...prev,
      career: newCareer
    }));
  };

  const handleEducationRemove = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      education: newEducation
    }));
  };

  const handleCareerRemove = (index) => {
    const newCareer = formData.career.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      career: newCareer
    }));
  };

  const handleSubmit = () => {
    // 저장 로직
    alert('프로필이 수정되었습니다.');
    navigate('/lawyer-profile');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까?')) {
      alert('계정이 삭제되었습니다.');
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <>
      <div className="px-[50px] py-[10px] flex-1">
        {/* 환영 문구 */}
        <div className="py-[30px] h-[100px]">
          <div className="h-[60px] flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-[40px] font-bold text-black">{formData.name}</span>
              <span className="text-[40px] font-medium text-black ml-[10px]">변호사님 환영합니다!</span>
            </div>
            <div className="flex items-center gap-[15px]">
              <button
                onClick={() => navigate('/lawyer-profile')}
                className="text-[13px] font-bold text-[#9ec3e5] hover:underline cursor-pointer"
              >
                뒤로가기
              </button>
              <button
                onClick={handleDeleteAccount}
                className="text-[13px] font-bold text-[#ff3333] hover:underline cursor-pointer"
              >
                계정 삭제
              </button>
            </div>
          </div>
          <div className="h-[30px] flex items-center mt-[10px]">
            <span className="text-[20px] text-black">사용자님에게</span>
            <span className="text-[20px] font-bold text-black ml-[5px]">{formData.name}</span>
            <span className="text-[20px] text-black ml-[5px]">변호사님을 소개해 보세요.</span>
          </div>
        </div>

        {/* 구분선과 저장 버튼 */}
        <div className="h-[70px] relative">
          {/* 검은색 구분선 */}
          <div className="absolute left-[60px] top-[24px] w-[784px] h-[1px] bg-black mt-[20px]" />
          {/* 저장 버튼 - 오른쪽 끝, 줄 위에 배치 */}
          <div
            className="absolute right-[76px] top-[10px] flex items-center justify-center w-[66px] h-[28px] mt-[20px] cursor-pointer hover:bg-[#8bb5d9] bg-[#9ec3e5] z-10"
            onClick={handleSubmit}
          >
            <span className="text-[15px] font-bold text-black">저장</span>
          </div>
        </div>

        {/* 프로필 편집 박스 */}
        <div className="h-auto flex gap-[10px] py-[10px]">
          {/* 이미지 */}
          <div className="w-[300px] h-[399px] overflow-hidden relative">
            <img
              src={imgLawyerPic}
              alt={formData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <div className="w-[100px] h-[100px] rounded-full bg-black bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-opacity-70">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="20" stroke="white" strokeWidth="2"/>
                  <path d="M25 15L25 35M15 25L35 25" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* 소개 및 연락처 편집 */}
          <div className="flex-1 flex flex-col px-[20px]">
            {/* 소개 텍스트 */}
            <div className="h-auto py-[10px]">
              <textarea
                name="introduction"
                value={formData.introduction}
                onChange={handleInputChange}
                className="w-full h-[270px] text-[15px] text-[#6b6b6b] font-bold leading-[normal] border-[3px] border-[#d9d9d9] p-[10px] resize-none focus:outline-none focus:border-[#9ec3e5] placeholder:text-[#c3c3c3]"
                placeholder={`변호사님, 상담 가능 시간과 간단한 소개글을 입력해주세요.

상담 가능 시간:
     예: 평일 10:00 ~ 18:00 / 점심시간 12:00~13:00 제외


자기소개글:
     예: 노동법 및 임대차 분야에서 10년간 실무 경험을 쌓았습니다.
          의뢰인의 입장에서 현실적인 해결책을 제시드리는 상담을 지향합니다.`}
              />
            </div>

            {/* 연락처 정보 */}
            <div className="h-auto pt-[10px] flex gap-[30px] relative">
              {/* 이름, 연락처 */}
              <div className="flex gap-[5px] text-[17px]">
                <div className="flex flex-col gap-[21px] font-bold text-black whitespace-nowrap">
                  <div>이름:</div>
                  <div>연락처:</div>
                </div>
                <div className="flex flex-col gap-[21px] text-[#6b6b6b]">
                  <div className="font-bold whitespace-nowrap">{formData.name}</div>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-[#d5d5d5] px-[8px] py-[1px] font-normal focus:outline-none focus:bg-[#c5c5c5] min-w-[130px]"
                    style={{ width: `${Math.max(130, formData.phone.length * 11 + 30)}px` }}
                  />
                </div>
              </div>

              {/* 이메일, 주소 */}
              <div className="flex gap-[5px] text-[17px]">
                <div className="flex flex-col gap-[21px] font-bold text-black whitespace-nowrap">
                  <div>이메일:</div>
                  <div>주소:</div>
                </div>
                <div className="flex flex-col gap-[21px] text-[#6b6b6b]">
                  <div className="font-bold whitespace-nowrap">{formData.email}</div>
                  <div className="flex flex-col gap-[2px]">
                    <input
                      type="text"
                      name="address"
                      value={formData.address.split(' ').slice(0, 4).join(' ')}
                      onChange={handleInputChange}
                      className="bg-[#d5d5d5] px-[8px] py-[1px] font-normal focus:outline-none focus:bg-[#c5c5c5] min-w-[200px]"
                      style={{ width: `${Math.max(200, formData.address.split(' ').slice(0, 4).join(' ').length * 12 + 30)}px` }}
                    />
                    <input
                      type="text"
                      name="addressDetail"
                      value={formData.address.split(' ').slice(4).join(' ')}
                      onChange={handleInputChange}
                      className="bg-[#d5d5d5] px-[8px] py-[1px] font-normal focus:outline-none focus:bg-[#c5c5c5] min-w-[150px]"
                      style={{ width: `${Math.max(150, formData.address.split(' ').slice(4).join(' ').length * 12 + 30)}px` }}
                    />
                  </div>
                </div>
              </div>

              {/* 주소 찾기 버튼 */}
              <button
                className="absolute right-0 bottom-0 border-2 border-[#787878] px-[8px] py-[2px] h-auto text-[12px] hover:bg-gray-100 whitespace-nowrap"
                onClick={() => alert('주소 검색 기능은 준비 중입니다.')}
              >
                주소 찾기
              </button>
            </div>
          </div>
        </div>

        {/* 파란색 구분선 */}
        <div className="h-[35px] flex items-center">
          <div className="w-full h-[5px] bg-[#9ec3e5]" />
        </div>

        {/* 전문 분야 */}
        <div className="py-[10px] px-[20px]">
          <h3 className="text-[20px] font-bold text-black mb-[10px]">전문 분야</h3>
          <div className="flex flex-wrap items-end gap-[13px] px-[15px] pb-[15px]">
            {/* 추가 버튼 */}
            <button
              onClick={handleSpecialtyAdd}
              className="border-[3px] border-[#9ec3e5] rounded-[20px] w-[100px] h-[40px] flex items-center justify-center hover:bg-[#e8f2fb]"
            >
              <img src="/assets/plus_on.png" alt="추가" className="w-[15px] h-[15px]" />
            </button>

            {formData.specialties.map((specialty, idx) => (
              <div key={idx} className="flex flex-col gap-[5px] items-center">
                {/* 삭제 아이콘 */}
                <button
                  onClick={() => handleSpecialtyRemove(idx)}
                  className="w-[16px] h-[16px] hover:opacity-70"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#FF3333" strokeWidth="2"/>
                    <path d="M5 8H11" stroke="#FF3333" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                {/* 분야 입력 */}
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => handleSpecialtyChange(idx, e.target.value)}
                  className="border-[3px] border-[#9ec3e5] rounded-[20px] px-[10px] py-[5px] bg-white text-[15px] font-bold text-black focus:outline-none focus:border-[#7da9d3] text-center min-w-[80px] h-[40px]"
                  placeholder="분야 입력"
                  style={{ width: `${Math.max(80, specialty.length * 15 + 30)}px` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 회색 구분선 */}
        <div className="h-[66px] flex items-center px-[50px]">
          <div className="w-[820px] h-[1px] bg-[#787878]" />
        </div>

        {/* 학력 및 경력 */}
        <div className="flex gap-[10px] px-[10px]">
          {/* 학력 */}
          <div className="bg-white p-[10px]">
            <h3 className="text-[20px] font-bold text-black mb-[10px]">학력:</h3>
            <div className="flex flex-col gap-[10px]">
              {formData.education.map((edu, idx) => (
                <div key={idx} className="flex items-start gap-[20px]">
                  <button
                    onClick={() => handleEducationRemove(idx)}
                    className="text-[15px] font-bold text-[#ff3333] hover:underline"
                  >
                    삭제
                  </button>
                  <input
                    type="text"
                    value={edu}
                    onChange={(e) => handleEducationChange(idx, e.target.value)}
                    className="flex-1 text-[20px] font-bold text-[#6b6b6b] border-b border-transparent hover:border-[#d9d9d9] focus:outline-none focus:border-[#9ec3e5] pb-[2px]"
                    placeholder="학력 입력"
                  />
                </div>
              ))}
              <button
                onClick={handleEducationAdd}
                className="flex items-center gap-[5px] px-[50px] text-[15px] font-bold text-[#b8b8b8] hover:text-[#9ec3e5]"
              >
                <img src="/assets/plus_on.png" alt="추가" className="w-[15px] h-[15px]" />
                추가
              </button>
            </div>
          </div>

          {/* 경력 */}
          <div className="bg-white p-[10px]">
            <h3 className="text-[20px] font-bold text-black mb-[10px]">경력:</h3>
            <div className="flex flex-col gap-[10px]">
              {formData.career.map((car, idx) => (
                <div key={idx} className="flex items-start gap-[20px]">
                  <button
                    onClick={() => handleCareerRemove(idx)}
                    className="text-[15px] font-bold text-[#ff3333] hover:underline"
                  >
                    삭제
                  </button>
                  <input
                    type="text"
                    value={car}
                    onChange={(e) => handleCareerChange(idx, e.target.value)}
                    className="flex-1 text-[20px] font-bold text-[#6b6b6b] border-b border-transparent hover:border-[#d9d9d9] focus:outline-none focus:border-[#9ec3e5] pb-[2px]"
                    placeholder="경력 입력"
                  />
                </div>
              ))}
              <button
                onClick={handleCareerAdd}
                className="flex items-center gap-[5px] px-[50px] text-[15px] font-bold text-[#b8b8b8] hover:text-[#9ec3e5]"
              >
                <img src="/assets/plus_on.png" alt="추가" className="w-[15px] h-[15px]" />
                추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LawyerProfileEditContent;
