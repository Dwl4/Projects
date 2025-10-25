import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lawyerService } from '../api';

const LawyerProfileEditContent = () => {
  const navigate = useNavigate();
  const [lawyerData, setLawyerData] = useState(null);

  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    detailedAddress: '',
    lawFirm: '',
    lawyerRegistrationNumber: '',
    introduction: '',
    specialties: [],
    education: [],
    career: [],
    consultationFee: '',
    region: '',
  });

  // 프로필 이미지 상태
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // 이미지 경로
  const imgLawyerPic = "/assets/lawyer-pic.png";

  useEffect(() => {
    const fetchLawyerProfile = async () => {
      try {
        console.log('🔍 변호사 프로필 조회 시작...');

        // API로 변호사 정보 조회
        const userData = await lawyerService.getCurrentLawyer();

        console.log('✅ 변호사 프로필 조회 성공:', userData);

        setLawyerData(userData);

        // 폼 데이터 초기화 (서버 응답 필드명에 맞춤)
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          email: userData.email || '',
          address: userData.address || '',
          detailedAddress: userData.detailed_address || '',
          lawFirm: userData.law_firm || '',
          lawyerRegistrationNumber: userData.lawyer_registration_number || '',
          introduction: userData.introduction || '',
          specialties: userData.specialties || [],
          education: userData.education || [],
          career: userData.career || [],
          consultationFee: userData.consultation_fee || '',
          region: userData.region || '',
        });

        // 프로필 이미지 URL 설정
        if (userData.profile_image) {
          const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://54.180.238.189:8001/api/v1';
          const baseUrl = API_BASE.replace('/api/v1', '');
          setProfileImagePreview(userData.profile_image.startsWith('http') ? userData.profile_image : `${baseUrl}${userData.profile_image}`);
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
          setFormData({
            name: userData.name || '',
            phone: userData.phone || '',
            email: userData.email || '',
            address: userData.address || '',
            detailedAddress: userData.detailed_address || '',
            lawFirm: userData.law_firm || '',
            lawyerRegistrationNumber: userData.lawyer_registration_number || '',
            introduction: userData.introduction || '',
            specialties: userData.specialties || [],
            education: userData.education || [],
            career: userData.career || [],
            consultationFee: userData.consultation_fee || '',
            region: userData.region || '',
          });
        }
      }
    };

    fetchLawyerProfile();
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
      education: [...prev.education, { school: '', major: '', degree: '' }]
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      education: newEducation
    }));
  };

  const handleCareerAdd = () => {
    setFormData(prev => ({
      ...prev,
      career: [...prev.career, { company: '', position: '', years: 0 }]
    }));
  };

  const handleCareerChange = (index, field, value) => {
    const newCareer = [...formData.career];
    newCareer[index] = {
      ...newCareer[index],
      [field]: value
    };
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('========== 변호사 프로필 수정 시작 ==========');

      const formDataToSend = new FormData();

      // 기본 정보
      console.log('📝 기본 정보:');
      console.log('  - name:', formData.name);
      console.log('  - phone:', formData.phone);
      console.log('  - law_firm:', formData.lawFirm);
      console.log('  - address:', formData.address);
      console.log('  - detailed_address:', formData.detailedAddress);
      console.log('  - lawyer_registration_number:', formData.lawyerRegistrationNumber);

      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('law_firm', formData.lawFirm);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('detailed_address', formData.detailedAddress);
      formDataToSend.append('lawyer_registration_number', formData.lawyerRegistrationNumber);

      // 프로필 정보
      console.log('\n📋 프로필 정보:');
      console.log('  - introduction:', formData.introduction);
      console.log('  - consultation_fee:', formData.consultationFee || 0);
      console.log('  - region:', formData.region);

      formDataToSend.append('introduction', formData.introduction);
      formDataToSend.append('consultation_fee', formData.consultationFee || 0);
      formDataToSend.append('region', formData.region);

      // 배열 정보 (JSON 문자열로 변환)
      console.log('\n📚 배열 정보:');
      console.log('  - specialties:', formData.specialties);
      console.log('  - specialties JSON:', JSON.stringify(formData.specialties));
      console.log('  - education:', formData.education);
      console.log('  - education JSON:', JSON.stringify(formData.education));
      console.log('  - career:', formData.career);
      console.log('  - career JSON:', JSON.stringify(formData.career));

      formDataToSend.append('specialties', JSON.stringify(formData.specialties));
      formDataToSend.append('education', JSON.stringify(formData.education));
      formDataToSend.append('career', JSON.stringify(formData.career));

      // 프로필 이미지 (파일이 있을 경우만)
      if (profileImage) {
        console.log('\n🖼️ 프로필 이미지:');
        console.log('  - 파일명:', profileImage.name);
        console.log('  - 파일 크기:', profileImage.size, 'bytes');
        console.log('  - 파일 타입:', profileImage.type);
        formDataToSend.append('profile_image', profileImage);
      } else {
        console.log('\n🖼️ 프로필 이미지: 없음 (기존 이미지 유지)');
      }

      // FormData 내용 전체 출력
      console.log('\n📦 전송될 FormData 전체:');
      for (let pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  - ${pair[0]}: [File] ${pair[1].name}`);
        } else {
          console.log(`  - ${pair[0]}:`, pair[1]);
        }
      }

      console.log('\n🚀 API 호출: PUT /api/v1/lawyers/me');

      // API 호출
      const updatedData = await lawyerService.updateMyProfile(formDataToSend);

      console.log('✅ 프로필 수정 성공!');
      console.log('📥 서버 응답:', updatedData);

      // localStorage 업데이트
      localStorage.setItem('currentUser', JSON.stringify(updatedData));

      alert('프로필이 수정되었습니다.');
      navigate('/lawyer-profile');
    } catch (error) {
      console.error('❌ 프로필 수정 실패:', error);
      console.error('❌ 에러 응답:', error.response?.data);
      console.error('❌ 에러 상태:', error.response?.status);
      alert('프로필 수정 중 오류가 발생했습니다.');
    }
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
          <button
            className="absolute right-[50px] top-[10px] flex items-center justify-center gap-[5px] px-[20px] h-[36px] mt-[20px] cursor-pointer bg-[#9ec3e5] hover:bg-[#7da9d3] active:bg-[#6b98c2] rounded-[8px] shadow-[0px_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0px_3px_6px_rgba(0,0,0,0.15)] transition-all duration-200 z-10"
            onClick={handleSubmit}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 2H3.5C2.67 2 2 2.67 2 3.5V12.5C2 13.33 2.67 14 3.5 14H12.5C13.33 14 14 13.33 14 12.5V3.5C14 2.67 13.33 2 12.5 2ZM11 5L7 9L5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[15px] font-bold text-white">저장</span>
          </button>
        </div>

        {/* 프로필 편집 박스 */}
        <div className="h-auto flex gap-[10px] py-[10px]">
          {/* 이미지 */}
          <div className="w-[300px] h-[399px] overflow-hidden relative">
            <img
              src={profileImagePreview || imgLawyerPic}
              alt={formData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <label className="w-[100px] h-[100px] rounded-full bg-black bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-opacity-70">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="20" stroke="white" strokeWidth="2"/>
                  <path d="M25 15L25 35M15 25L35 25" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </label>
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
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="도로명 주소"
                      className="bg-[#d5d5d5] px-[8px] py-[1px] font-normal focus:outline-none focus:bg-[#c5c5c5] min-w-[200px]"
                      style={{ width: `${Math.max(200, formData.address.length * 12 + 30)}px` }}
                    />
                    <input
                      type="text"
                      name="detailedAddress"
                      value={formData.detailedAddress}
                      onChange={handleInputChange}
                      placeholder="상세주소"
                      className="bg-[#d5d5d5] px-[8px] py-[1px] font-normal focus:outline-none focus:bg-[#c5c5c5] min-w-[150px]"
                      style={{ width: `${Math.max(150, formData.detailedAddress.length * 12 + 30)}px` }}
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
          <div className="bg-white p-[10px] flex-1">
            <h3 className="text-[20px] font-bold text-black mb-[10px]">학력:</h3>
            <div className="flex flex-col gap-[10px]">
              {formData.education.map((edu, idx) => (
                <div key={idx} className="flex flex-col gap-[5px] border-b border-gray-200 pb-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#6b6b6b]">학력 {idx + 1}</span>
                    <button
                      onClick={() => handleEducationRemove(idx)}
                      className="text-[13px] font-bold text-[#ff3333] hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                  <input
                    type="text"
                    value={edu.school || ''}
                    onChange={(e) => handleEducationChange(idx, 'school', e.target.value)}
                    className="w-full text-[16px] font-bold text-[#6b6b6b] border-b border-transparent hover:border-[#d9d9d9] focus:outline-none focus:border-[#9ec3e5] pb-[2px]"
                    placeholder="학교명"
                  />
                  <input
                    type="text"
                    value={edu.major || ''}
                    onChange={(e) => handleEducationChange(idx, 'major', e.target.value)}
                    className="w-full text-[16px] text-[#6b6b6b] border-b border-transparent hover:border-[#d9d9d9] focus:outline-none focus:border-[#9ec3e5] pb-[2px]"
                    placeholder="전공"
                  />
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                    className="w-full text-[16px] text-[#6b6b6b] border-b border-transparent hover:border-[#d9d9d9] focus:outline-none focus:border-[#9ec3e5] pb-[2px]"
                    placeholder="학위 (학사/석사/박사)"
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
          <div className="bg-white p-[10px] flex-1">
            <h3 className="text-[20px] font-bold text-black mb-[10px]">경력:</h3>
            <div className="flex flex-col gap-[10px]">
              {formData.career.map((car, idx) => (
                <div key={idx} className="flex flex-col gap-[5px] border-b border-gray-200 pb-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#6b6b6b]">경력 {idx + 1}</span>
                    <button
                      onClick={() => handleCareerRemove(idx)}
                      className="text-[13px] font-bold text-[#ff3333] hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                  <input
                    type="text"
                    value={car.company || ''}
                    onChange={(e) => handleCareerChange(idx, 'company', e.target.value)}
                    className="w-full text-[16px] font-bold text-[#6b6b6b] border-b border-transparent hover:border-[#d9d9d9] focus:outline-none focus:border-[#9ec3e5] pb-[2px]"
                    placeholder="회사/기관명"
                  />
                  <input
                    type="text"
                    value={car.position || ''}
                    onChange={(e) => handleCareerChange(idx, 'position', e.target.value)}
                    className="w-full text-[16px] text-[#6b6b6b] border-b border-transparent hover:border-[#d9d9d9] focus:outline-none focus:border-[#9ec3e5] pb-[2px]"
                    placeholder="직책/직위"
                  />
                  <input
                    type="number"
                    value={car.years || ''}
                    onChange={(e) => handleCareerChange(idx, 'years', parseInt(e.target.value) || 0)}
                    className="w-full text-[16px] text-[#6b6b6b] border-b border-transparent hover:border-[#d9d9d9] focus:outline-none focus:border-[#9ec3e5] pb-[2px]"
                    placeholder="근무 연수"
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
