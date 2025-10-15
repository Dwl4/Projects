import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LawyerLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const imgNukkiResult1 = "/assets/Lawyer.png";

  const handleLogin = () => {
    // 로그인 처리 로직
    console.log('Lawyer Login:', { email, password });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-[#9ec3e5] rounded-[50px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-[35px] pb-[50px] pt-[20px] flex flex-col items-center gap-[15px] w-[450px]">
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
                className="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-full rounded-full"
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
            placeholder="비밀번호"
            className="w-full bg-transparent outline-none text-[14px] text-black placeholder-[#a7a7a7]"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="bg-[#f0f0f0] rounded-[15px] h-[60px] w-[220px] flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
        >
          <span className="text-[20px] font-bold text-neutral-700">로그인</span>
        </button>
      </div>
    </div>
  );
};

export default LawyerLoginPage;
