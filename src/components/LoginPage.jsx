import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService, lawyerService } from '../api';

const imgLawMatrLogo = "/assets/Lawmate_Logo.png";
const imgLogin = "/assets/Login.png";
const imgImage12 = "/assets/Logout_Image.png";
const imgKakao = "/assets/Kakao.png";
const imgNaver = "/assets/Naver.png";
const imgGoogle = "/assets/Google.png";
const imgEMail = "/assets/Email.png";
const imgNukkiResult1 = "/assets/Lawyer.png";

export default function LoginPage() {
  const [showLawyerLogin, setShowLawyerLogin] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 페이지 로드 시 state 초기화
  useEffect(() => {
    setShowLawyerLogin(false);
    setShowEmailLogin(false);
    setEmail('');
    setPassword('');
  }, []);

  const handleLawyerLogin = async () => {
    // 이메일과 비밀번호 입력 확인
    if (!email || !password) {
      alert('이메일 주소와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // API 로그인 호출
      await authService.login(email, password, 'lawyer');

      // 변호사 정보 조회 (GET /api/v1/lawyers/me)
      const lawyerData = await lawyerService.getCurrentLawyer();

      // 로그인 성공 시 사용자 정보 저장
      localStorage.setItem('currentUser', JSON.stringify(lawyerData));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', lawyerData.name || '변호사');
      localStorage.setItem('isLawyer', 'true');

      alert('변호사 로그인 성공!');
      window.location.href = '/';
    } catch (error) {
      console.error('로그인 실패:', error);
      if (error.response?.status === 401) {
        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleEmailLogin = async () => {
    // 이메일과 비밀번호 입력 확인
    if (!email || !password) {
      alert('이메일 주소와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // API 로그인 호출
      const result = await authService.login(email, password, 'user');

      // 로그인 성공 시 사용자 정보 저장
      localStorage.setItem('currentUser', JSON.stringify(result.user || {}));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', result.user?.nickname || result.user?.name || '사용자');
      localStorage.setItem('isLawyer', 'false');

      alert('로그인 성공!');
      window.location.href = '/';
    } catch (error) {
      console.error('로그인 실패:', error);
      if (error.response?.status === 401) {
        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 엔터 키 핸들러
  const handleKeyDown = (e, loginType) => {
    if (e.key === 'Enter') {
      if (loginType === 'email') {
        handleEmailLogin();
      } else if (loginType === 'lawyer') {
        handleLawyerLogin();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* 1600px 컨테이너, 중앙 정렬 */}
      <div className="w-[1600px] mx-auto flex flex-col items-center">
        {/* 로고 섹션 */}
        <div className="mb-[20px]">
          <Link to="/">
            <div
              className="w-[200px] h-[200px] bg-center bg-cover bg-no-repeat cursor-pointer"
              style={{ backgroundImage: `url('${imgLogin}')` }}
            />
          </Link>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="w-[1020px] border border-[#bcbcbc] rounded-[30px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.5)] py-[40px] px-[25px] bg-white">
          {/* 제목 */}
          <div className="text-center mb-[40px]">
            <h1 className="text-[39px] font-bold text-black">로그인 / 회원가입</h1>
          </div>

          {/* 로그인 섹션 */}
          <div className="flex gap-[50px] justify-center mb-[20px] px-[10px]">
            {/* 일반 사용자 로그인 */}
            <div className="w-[450px] bg-[#9ec3e5] rounded-[50px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[35px] pb-[50px] pt-[20px] flex flex-col items-center gap-[15px]">
              {!showEmailLogin ? (
                <>
                  {/* 제목 */}
                  <div className="text-center">
                    <h2 className="text-[20px] font-bold text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                      <span className="font-bold">일반 사용자</span>
                      <span className="font-normal">이신가요?</span>
                    </h2>
                  </div>

                  {/* 사용자 이미지 */}
                  <div className="flex justify-center h-[180px] w-[380px] px-[100px]">
                    <div
                      className="w-[180px] h-[180px] bg-center bg-cover bg-no-repeat"
                      style={{ backgroundImage: `url('${imgImage12}')` }}
                    />
                  </div>

                  {/* 이메일 로그인 버튼 */}
                  <div className="mb-[40px] mt-[40px]">
                    <button
                      onClick={() => {
                        setShowEmailLogin(true);
                        setShowLawyerLogin(false);
                      }}
                      className="bg-[#f0f0f0] rounded-[15px] w-[180px] h-[60px] flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <span className="text-[20px] font-bold text-neutral-700">이메일로 로그인</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* 제목 */}
                  <div className="text-center">
                    <h2 className="text-[20px] font-bold text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                      <span className="font-bold">일반 사용자</span>
                      <span className="font-normal">이신가요?</span>
                    </h2>
                  </div>

                  {/* 사용자 이미지 */}
                  <div className="flex justify-center h-[180px] w-[380px] px-[100px]">
                    <div
                      className="w-[180px] h-[180px] bg-center bg-cover bg-no-repeat"
                      style={{ backgroundImage: `url('${imgImage12}')` }}
                    />
                  </div>

                  {/* 이메일 입력 */}
                  <div className="bg-[#ededed] rounded-[5px] h-[40px] w-[300px] px-[16px] py-[8px] flex items-center">
                    <input
                      type="email"
                      placeholder="이메일 주소"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'email')}
                      className="w-full bg-transparent outline-none text-[14px] text-black placeholder-[#a7a7a7]"
                    />
                  </div>

                  {/* 비밀번호 입력 */}
                  <div className="bg-[#ededed] rounded-[5px] h-[40px] w-[300px] px-[16px] py-[8px] flex items-center">
                    <input
                      type="password"
                      placeholder="비밀번호"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'email')}
                      className="w-full bg-transparent outline-none text-[14px] text-black placeholder-[#a7a7a7]"
                    />
                  </div>

                  {/* 로그인 버튼 */}
                  <button
                    onClick={handleEmailLogin}
                    className="bg-[#f0f0f0] rounded-[15px] h-[60px] w-[220px] flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="text-[20px] font-bold text-neutral-700">로그인</span>
                  </button>
                </>
              )}
            </div>

            {/* 변호사 로그인 */}
            <div className="w-[450px] bg-[#9ec3e5] rounded-[50px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[35px] pb-[50px] pt-[20px] flex flex-col items-center flex-shrink-0 gap-[15px]">
              {!showLawyerLogin ? (
                <>
                  {/* 제목 */}
                  <div className="text-center">
                    <h2 className="text-[20px] font-bold text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                      <span className="font-bold">변호사</span>
                      <span className="font-normal">이신가요?</span>
                    </h2>
                  </div>

                  {/* 변호사 이미지 */}
                  <div className="flex justify-center h-[180px] w-[380px] px-[100px]">
                    <div className="relative w-[180px] h-[180px]">
                      <div className="absolute bg-white rounded-full size-[180px] left-0 top-0" />
                      <div className="absolute size-[180px] left-0 top-0">
                        <img
                          alt="변호사"
                          className="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-full"
                          src={imgNukkiResult1}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 변호사 로그인 버튼 */}
                  <div className="mb-[40px] mt-[40px]">
                    <button
                      onClick={() => {
                        setShowLawyerLogin(true);
                        setShowEmailLogin(false);
                      }}
                      className="bg-[#f0f0f0] rounded-[15px] w-[180px] h-[60px] flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <span className="text-[20px] font-bold text-neutral-700">변호사 로그인</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* 제목 */}
                  <div className="text-center">
                    <h2 className="text-[20px] font-bold text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                      <span className="font-bold">변호사</span>
                      <span className="font-normal">이신가요?</span>
                    </h2>
                  </div>

                  {/* 변호사 이미지 */}
                  <div className="flex justify-center h-[180px] w-[380px] px-[100px]">
                    <div className="relative w-[180px] h-[180px]">
                      <div className="absolute bg-white rounded-full size-[180px] left-0 top-0" />
                      <div className="absolute size-[180px] left-0 top-0">
                        <img
                          alt="변호사"
                          className="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-full"
                          src={imgNukkiResult1}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 이메일 입력 */}
                  <div className="bg-[#ededed] rounded-[5px] h-[40px] w-[300px] px-[16px] py-[8px] flex items-center">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'lawyer')}
                      placeholder="이메일 주소"
                      className="w-full bg-transparent outline-none text-[14px] text-black placeholder-[#a7a7a7]"
                    />
                  </div>

                  {/* 비밀번호 입력 */}
                  <div className="bg-[#ededed] rounded-[5px] h-[40px] w-[300px] px-[16px] py-[8px] flex items-center">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'lawyer')}
                      placeholder="비밀번호"
                      className="w-full bg-transparent outline-none text-[14px] text-black placeholder-[#a7a7a7]"
                    />
                  </div>

                  {/* 로그인 버튼 */}
                  <button
                    onClick={handleLawyerLogin}
                    className="bg-[#f0f0f0] rounded-[15px] h-[60px] w-[220px] flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="text-[20px] font-bold text-neutral-700">로그인</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-[950px] h-[1px] bg-[#d9d9d9] mx-auto mb-[20px]" />

          {/* 회원가입 섹션 */}
          <div className="flex gap-[90px] justify-center items-center h-[60px] px-[35px]">
            {/* 일반 사용자 회원가입 */}
            <div className="w-[370px] flex items-center justify-between">
              <span className="text-[20px] text-black">계정이 없으신가요?</span>
              <Link to="/signup">
                <button className="bg-[#cccccc] rounded-[15px] w-[180px] h-[60px] flex flex-col items-center justify-center">
                  <div
                    className="w-[25px] h-[25px] bg-center bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url('${imgEMail}')` }}
                  />
                  <span className="text-[15px] font-bold text-neutral-700">이메일로 회원가입</span>
                </button>
              </Link>
            </div>

            {/* 변호사 회원가입 */}
            <div className="w-[370px] flex items-center justify-between">
              <span className="text-[20px] text-black">변호사 이신가요?</span>
              <Link to="/lawyer-signup">
                <button className="bg-[#cccccc] rounded-[15px] w-[180px] h-[60px] flex items-center justify-center">
                  <span className="text-[20px] font-bold text-neutral-700">변호사 회원가입</span>
                </button>
              </Link>
            </div>
          </div>
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