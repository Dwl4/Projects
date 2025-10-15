import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { demoUsers } from '../data/demoData';

const imgLogin = "/assets/Login.png";
const imgKakao = "/assets/Kakao.png";
const imgGoogle = "/assets/Google.png";
const imgNaver = "/assets/Naver.png";
const imgNukkiResult1 = "/assets/Lawyer.png";
const imgEMail = "/assets/Email.png";
const imgLawMatrLogo = "/assets/Lawmate_Logo.png";

export default function EmailLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // 이메일과 비밀번호 입력 확인
    if (!email || !password) {
      alert('이메일 주소와 비밀번호를 입력해주세요.');
      return;
    }

    // demoUsers에서 사용자 정보 확인
    const user = demoUsers.find(u => u.email === email && u.password === password);

    if (user) {
      // 로그인 성공 - LawmatePage.jsx에서 읽는 localStorage 키 설정
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', user.nickname);
      alert('로그인 성공!');
      navigate('/'); // 메인 페이지로 이동
    } else {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
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
            <div className="w-[450px] bg-[#9ec3e5] rounded-[50px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[35px] flex flex-col items-center">
              {/* 제목 */}
              <div className="text-center mb-[30px]">
                <h2 className="text-[30px] font-bold text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                  로그인
                </h2>
              </div>
              {/* 소셜 로그인 아이콘들 */}
              <div className="flex gap-[20px] justify-center mb-[30px]">
                <div className="w-[60px] h-[60px] bg-gray-200 rounded-full flex items-center justify-center">
                  <img alt="Kakao" className="w-[40px] h-[40px]" src={imgKakao} />
                </div>
                <div className="w-[60px] h-[60px] bg-gray-200 rounded-full flex items-center justify-center">
                  <img alt="Google" className="w-[40px] h-[40px]" src={imgGoogle} />
                </div>
                <div className="w-[60px] h-[60px] bg-gray-200 rounded-full flex items-center justify-center">
                  <img alt="Naver" className="w-[40px] h-[40px]" src={imgNaver} />
                </div>
              </div>
              {/* 이메일 입력 */}
              <div className="bg-[#ededed] rounded-[5px] p-[12px] mb-[15px] w-[300px]">
                <input
                  type="email"
                  placeholder="이메일 주소"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-[13px] text-black outline-none w-full placeholder-[#a7a7a7]"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div className="bg-[#ededed] rounded-[5px] p-[12px] mb-[30px] w-[300px]">
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-[13px] text-black outline-none w-full placeholder-[#a7a7a7]"
                />
              </div>

              {/* 로그인 버튼 */}
              <button
                onClick={handleLogin}
                className="bg-[#f0f0f0] h-[60px] rounded-[15px] w-[220px] hover:bg-[#e0e0e0] transition-colors cursor-pointer font-bold text-[20px] text-neutral-700"
              >
                로그인
              </button>
            </div>
            {/* 변호사 로그인 */}
            <div className="w-[450px] bg-[#9ec3e5] rounded-[50px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[35px] flex flex-col items-center flex-shrink-0">
              {/* 제목 */}
              <div className="text-center mb-[30px]">
                <h2 className="text-[20px] font-bold text-white drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                  <span className="font-bold">변호사</span>
                  <span className="font-normal">이신가요?</span>
                </h2>
              </div>

              {/* 변호사 이미지 */}
              <div className="mb-[30px] flex justify-center">
                <div className="relative">
                  <div className="w-[180px] h-[180px] bg-white rounded-full border-4 border-gray-300" />
                  <div className="absolute top-0 w-[180px] h-[180px]">
                    <img alt="" className="w-full h-full object-cover rounded-full" src={imgNukkiResult1} />
                  </div>
                </div>
              </div>

              {/* 변호사 로그인 버튼 */}
              <div className="mb-[40px] mt-[40px]">
                <button className="bg-[#f0f0f0] rounded-[15px] w-[180px] h-[60px] flex items-center justify-center">
                  <span className="text-[20px] font-bold text-neutral-700">변호사 로그인</span>
                </button>
              </div>
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
                <button className="bg-[#f0f0f0] rounded-[15px] w-[180px] h-[60px] flex items-center justify-center">
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
          <Link to="/">
            <div
              className="w-[300px] h-[100px] bg-left bg-no-repeat bg-[length:100%_297.62%] cursor-pointer"
              style={{ backgroundImage: `url('${imgLawMatrLogo}')` }}
            />
          </Link>
        </footer>
      </div>
    </div>
  );
}