import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../api';

const imgLogin = "/assets/Login.png";
const imgLawMatrLogo = "/assets/Lawmate_Logo.png";

export default function LawyerSignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    lawFirm: '',
    lawyerRegistrationNumber: '',
    phone: '',
    address: '',
    certificate: null
  });

  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    marketing: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      certificate: file
    }));
  };

  const handleAgreementChange = (name) => {
    if (name === 'all') {
      const newValue = !agreements.all;
      setAgreements({
        all: newValue,
        terms: newValue,
        privacy: newValue,
        marketing: newValue
      });
    } else {
      const newAgreements = {
        ...agreements,
        [name]: !agreements[name]
      };
      newAgreements.all = newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
      setAgreements(newAgreements);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 입력 필드 확인
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.lawFirm || !formData.address) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 필수 약관 동의 확인
    if (!agreements.terms || !agreements.privacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    try {
      // FormData 생성 (파일 업로드용)
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('law_firm', formData.lawFirm);
      formDataToSend.append('address', formData.address);

      // 프로필 이미지가 있으면 추가
      if (formData.certificate) {
        formDataToSend.append('profile_image', formData.certificate);
      }

      const result = await authService.registerLawyer(formDataToSend);
      console.log('변호사 회원가입 성공:', result);

      alert('성공적으로 변호사 회원가입이 완료되었습니다. 로그인 해주세요.');
      navigate('/login');
    } catch (error) {
      console.error('변호사 회원가입 실패:', error);
      if (error.response?.status === 409) {
        alert('이미 가입된 이메일입니다.');
      } else if (error.response?.data?.detail) {
        alert(`회원가입 실패: ${JSON.stringify(error.response.data.detail)}`);
      } else {
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleCancel = () => {
    // 로그인 페이지로 돌아가기
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* 1600px 컨테이너, 중앙 정렬 */}
      <div className="w-[1600px] mx-auto flex flex-col items-center">
        {/* 로고 섹션 */}
        <div className="h-[200px] flex items-center justify-center mb-[20px]">
          <Link to="/">
            <div
              className="w-[200px] h-[200px] bg-center bg-cover bg-no-repeat cursor-pointer"
              style={{ backgroundImage: `url('${imgLogin}')` }}
            />
          </Link>
        </div>

        {/* 변호사 회원가입 폼 */}
        <div className="w-[600px] bg-white border border-[#bcbcbc] rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[50px] flex flex-col items-center">
          {/* 제목 */}
          <div className="text-center mb-[40px]">
            <h1 className="text-[35px] font-bold text-black mb-[12px]">회원가입</h1>
            <p className="text-[15px] text-black">회원가입하고 다양한 혜택을 누려보세요!</p>
          </div>

          {/* 입력 폼 */}
          <form onSubmit={handleSubmit} className="w-[400px] flex flex-col gap-[20px]">
            {/* 이름 */}
            <div className="relative">
              <label className="block text-[14px] font-bold text-black mb-[8px]">이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="이름을 입력해주세요."
                className="w-full h-[35px] px-[12px] border border-[#929292] rounded-[10px] text-[11px] placeholder-[#acacac]"
              />
            </div>

            {/* 이메일 주소 */}
            <div className="relative">
              <label className="block text-[14px] font-bold text-black mb-2">이메일 주소</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="이메일 주소를 입력해주세요."
                className="w-full h-[35px] px-[12px] border border-[#929292] rounded-[10px] text-[11px] placeholder-[#acacac]"
              />
            </div>

            {/* 비밀번호 */}
            <div className="relative">
              <label className="block text-[14px] font-bold text-black mb-2">비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="비밀번호를 입력해주세요.(숫자, 영문, 특수문자 포함 10~15글자)"
                className="w-full h-[35px] px-[12px] border border-[#929292] rounded-[10px] text-[11px] placeholder-[#acacac]"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="relative">
              <label className="block text-[14px] font-bold text-black mb-2">비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="비밀번호 재입력"
                className="w-full h-[35px] px-[12px] border border-[#929292] rounded-[10px] text-[11px] placeholder-[#acacac]"
              />
            </div>

            {/* 닉네임 */}
            <div className="relative">
              <label className="block text-[14px] font-bold text-black mb-2">닉네임</label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="로우메이트에서 다른 사람들에게 보일 닉네임을 정해주세요."
                className="w-full h-[35px] px-[12px] border border-[#929292] rounded-[10px] text-[11px] placeholder-[#acacac]"
              />
            </div>

            {/* 변호사 사무소 */}
            <div className="relative">
              <label className="block text-[14px] font-bold text-black mb-2">변호사 사무소</label>
              <input
                type="text"
                name="lawFirm"
                value={formData.lawFirm}
                onChange={handleInputChange}
                placeholder="소속된 변호사 사무소명을 입력해주세요."
                className="w-full h-[35px] px-[12px] border border-[#929292] rounded-[10px] text-[11px] placeholder-[#acacac]"
              />
            </div>

            {/* 변호사 등록 번호 */}
            <div className="relative">
              <label className="block text-[14px] font-bold text-black mb-2">변호사 등록 번호</label>
              <input
                type="text"
                name="lawyerRegistrationNumber"
                value={formData.lawyerRegistrationNumber}
                onChange={handleInputChange}
                placeholder="변호사 등록 번호를 입력해주세요."
                className="w-full h-[35px] px-[12px] border border-[#929292] rounded-[10px] text-[11px] placeholder-[#acacac]"
              />
            </div>

            {/* 주소 */}
            <div className="relative">
              <label className="block text-[14px] font-bold text-black mb-2">주소</label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="상세주소를 입력해주세요."
                  className="w-full h-[35px] px-[12px] pr-[65px] border border-[#929292] rounded-[10px] text-[11px] placeholder-[#acacac]"
                />
                <button
                  type="button"
                  className="absolute right-[8px] top-1/2 transform -translate-y-1/2 bg-[#e0e0e0] text-[#5c5c5c] text-[11px] font-bold px-[12px] py-[4px] rounded"
                >
                  주소찾기
                </button>
              </div>
            </div>

            {/* 자격증 첨부 */}
            <div className="relative">
              <label className="block text-[14px] font-bold text-black mb-2">자격증 첨부</label>
              <div className="flex gap-[8px]">
                <input
                  type="text"
                  value={formData.certificate ? formData.certificate.name : ''}
                  placeholder="자격증 파일을 업로드해주세요."
                  readOnly
                  className="flex-1 h-[35px] px-[12px] border border-[#929292] rounded-[10px] text-[11px] placeholder-[#acacac] bg-gray-50"
                />
                <label className="bg-[#e0e0e0] text-[#5c5c5c] text-[11px] font-bold px-[16px] py-[8px] rounded cursor-pointer hover:bg-gray-300 transition-colors">
                  파일 업로드
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 이용약관 */}
            <div className="mt-[20px]">
              <div className="flex items-center mb-[8px]">
                <span className="text-[14px] font-bold text-black">이용약관 </span>
                <span className="text-[14px] font-bold text-red-500">*</span>
              </div>

              <div className="bg-[#9ec3e5] rounded-[10px] p-[20px] space-y-[12px]">
                {/* 전체 동의 */}
                <div className="flex items-center justify-between pb-3 border-b border-black">
                  <span className="text-[14px] font-bold text-black">약관 전체 동의하기</span>
                  <div className="flex-1 mx-[12px] border-b border-dotted border-black"></div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={agreements.all}
                      onChange={() => handleAgreementChange('all')}
                      className="w-5 h-5 border border-black rounded bg-[#9ec3e5] checked:bg-[#9ec3e5]"
                    />
                  </label>
                </div>

                {/* 개별 약관들 */}
                <div className="space-y-[8px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-black">
                      로우메이트 이용약관 동의 <span className="text-red-500">(필수)</span>
                    </span>
                    <div className="flex-1 mx-[12px] border-b border-dotted border-black"></div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={agreements.terms}
                        onChange={() => handleAgreementChange('terms')}
                        className="w-5 h-5 border border-black rounded bg-[#9ec3e5] checked:bg-[#9ec3e5]"
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-black">
                      개인정보 처리방침 동의 <span className="text-red-500">(필수)</span>
                    </span>
                    <div className="flex-1 mx-[12px] border-b border-dotted border-black"></div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={agreements.privacy}
                        onChange={() => handleAgreementChange('privacy')}
                        className="w-5 h-5 border border-black rounded bg-[#9ec3e5] checked:bg-[#9ec3e5]"
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-black">이벤트 정보 수신 동의 (선택)</span>
                    <div className="flex-1 mx-[12px] border-b border-dotted border-black"></div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={agreements.marketing}
                        onChange={() => handleAgreementChange('marketing')}
                        className="w-5 h-5 border border-black rounded bg-[#9ec3e5] checked:bg-[#9ec3e5]"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 버튼들 */}
            <div className="flex gap-[40px] justify-center mt-[32px]">
              <button
                type="submit"
                className="bg-[#ebebeb] rounded-[10px] shadow-[2px_2px_2px_0px_rgba(0,0,0,0.25)] w-[120px] h-[52px] text-[20px] font-bold text-black hover:bg-gray-200 transition-colors"
              >
                가입하기
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-[#ebebeb] rounded-[10px] shadow-[2px_2px_2px_0px_rgba(0,0,0,0.25)] w-[120px] h-[52px] text-[20px] font-bold text-black hover:bg-gray-200 transition-colors"
              >
                취소하기
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="relative z-50 bg-[#9ec3e5] h-[100px] mt-[50px] flex items-center justify-between px-[50px]">
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-white text-[12px] font-extralight text-shadow-[1px_1px_1px_rgba(0,0,0,0.25)] mb-[4px]">
              "LAW MATE는 법률 자문을 대체하지 않으며, AI가 제공하는 내용은 참고용 자료입니다. 실제 법률 자문은 반드시 변호사와 상담하시기 바랍니다."<br />
              "고객의 개인정보는 안전하게 보호되며, 최소한의 정보만 수집·활용합니다."
            </p>
            <p className="text-white text-[10px] font-extralight text-shadow-[1px_1px_1px_rgba(0,0,0,0.25)] text-right mb-[4px]">
              © 2025 LAW MATE. All Rights Reserved.
            </p>
            <div className="flex items-center justify-end gap-[10px] text-white text-[10px] font-extralight">
              <span className="text-shadow-[1px_1px_1px_rgba(0,0,0,0.25)]">대표자: 백정현, 이도원, 김석주</span>
              <span className="text-shadow-[1px_1px_1px_rgba(0,0,0,0.25)]">전화: +82 10-2450-2676</span>
              <span className="text-shadow-[1px_1px_1px_rgba(0,0,0,0.25)]">Email: rlatjrwn2676@naver.com</span>
            </div>
          </div>
          <div
            className="w-[300px] h-[100px] bg-left bg-no-repeat bg-[length:100%_297.62%]"
            style={{ backgroundImage: `url('${imgLawMatrLogo}')` }}
          />
        </footer>
      </div>
    </div>
  );
}