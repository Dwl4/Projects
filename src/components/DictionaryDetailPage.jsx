import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { demoDictionaryDetails } from '../data/demoData';

const DictionaryDetailPage = () => {
  const navigate = useNavigate();
  const { term } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Index');
  const [selectedConsonant, setSelectedConsonant] = useState('ㄱ');

  // 이미지 경로
  const imgLawMatrLogo = "/assets/Lawmate_Logo.png";
  const imgImage12 = "/assets/Logout_Image.png";
  const imgImage14 = "/assets/Login_Image.png";
  const imgSearch = "/assets/Search.png";

  // 용어 데이터 가져오기
  const termData = demoDictionaryDetails[term] || demoDictionaryDetails['공법'];

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    const storedUserName = localStorage.getItem('userName');
    const currentUser = localStorage.getItem('currentUser');

    if (loginStatus === 'true') {
      setIsLoggedIn(true);
      setUserName(storedUserName || 'Index');
    } else if (currentUser) {
      const userData = JSON.parse(currentUser);
      setIsLoggedIn(true);
      setUserName(userData.nickname || 'Index');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', userData.nickname);
    }
  }, []);

  const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  const LoggedInSidebar = () => (
    <>
      <aside className="w-[300px] bg-[#95b1d4] h-[300px] flex flex-col items-center justify-center p-[30px]">
        <div className="w-[240px] h-[150px] flex items-center justify-center">
          <div className="w-[150px] h-[150px] relative">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
              <div
                className="w-full h-full bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url('${imgImage14}')` }}
              />
            </div>
          </div>
        </div>
        <div className="text-center">
          <span className="text-white text-[20px] font-bold">{userName}님</span>
        </div>
        <div className="space-y-[8px] text-center">
          <button
            className="w-[200px] h-[31px] bg-white rounded-[5px] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] font-bold text-[#08213b] text-[15px]"
            onClick={() => navigate('/profile')}
          >
            프로필
          </button>
          <button
            className="w-[200px] h-[31px] bg-white rounded-[5px] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] font-bold text-[#08213b] text-[15px]"
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("userName");
              localStorage.removeItem("currentUser");
              setIsLoggedIn(false);
              setUserName("Index");
              window.dispatchEvent(new Event('localStorageChange'));
            }}
          >
            로그아웃
          </button>
        </div>
      </aside>

      <div className="w-[300px] bg-white border-r-[5px] border-[#d9d9d9] h-full">
        <div className="">
          <div className="flex items-center justify-between my-[5px]">
            <h3 className="text-[15px] font-bold text-[#03345a] pl-[30px]">최근사건 기록</h3>
            <span className="text-[15px] font-bold text-[#03345a] pr-[30px]">3/5</span>
          </div>
          <div className="w-[150px] h-[3px] bg-[#d9d9d9]" />

          <div className="space-y-[0px]">
            {[1, 2, 3].map((num) => (
              <div key={num}>
                <div className="py-[14.5px]">
                  <div className="mb-[8px]">
                    <span className="text-[16px] font-bold text-black pl-[30px]">사건{num}.</span>
                  </div>
                  <div className="pl-[20px]">
                    <p className="text-[12px] text-black leading-[1.5] pl-[30px]">'부당해고 구제제도' 개선 입법예고…"</p>
                  </div>
                </div>
                <div className="w-[295px] h-[3px] bg-[#d9d9d9] mb-[16px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const GuestSidebar = () => (
    <>
      <aside className="w-[300px] bg-[#95b1d4] h-[300px] flex flex-col items-center justify-center p-[30px]">
        <div className="w-[240px] h-[150px] flex items-center justify-center mb-[16px]">
          <div
            className="w-[150px] h-[150px] bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url('${imgImage12}')` }}
          />
        </div>
        <div className="space-y-[16px] text-center">
          <Link to="/login" className="block">
            <button className="w-[200px] h-[30px] bg-white rounded-[5px] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] font-bold text-[#08213b] text-[15px]">
              로그인
            </button>
          </Link>
          <Link to="/login" className="block">
            <button className="w-[200px] h-[30px] bg-white rounded-[5px] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] font-bold text-[#08213b] text-[15px]">
              회원가입
            </button>
          </Link>
        </div>
      </aside>

      <div className="w-[300px] bg-white border-r-[5px] border-[#d9d9d9] h-full">
        <h3 className="text-[15px] font-bold text-[#03345a] ml-[20px] my-[5px]">최근사건 기록</h3>
        <div className="w-[150px] h-[3px] bg-[#d9d9d9]" />
        <div className="py-[20px] text-center">
          <p className="text-[15px] font-semibold text-black leading-[1.5] mb-[16px]">
            로그인 하시면 사건 기록을<br />
            저장할 수 있습니다.
          </p>
          <p className="text-[13px] text-[#787878]">
            (최대 5개 까지 사건을 기록할 수 있습니다.)
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="w-[1320px] mx-auto">
        {/* 네비게이션 */}
        <header className="bg-[#9ec3e5] flex items-center justify-between pl-[30px] pr-[100px] py-[10px] h-20">
          <Link to="/">
            <div
              className="w-[238px] h-20 bg-left bg-no-repeat bg-cover cursor-pointer"
              style={{ backgroundImage: `url('${imgLawMatrLogo}')` }}
            />
          </Link>
          <nav className="flex items-center gap-[64px] text-white font-bold text-[16px]">
            <Link to="/" className="text-center cursor-pointer hover:text-gray-200 text-white">
              법률
            </Link>
            <Link to="/" className="text-center cursor-pointer hover:text-gray-200 text-white">
              판례
            </Link>
            <Link to="/community" className="text-center cursor-pointer hover:text-gray-200 text-white">
              커뮤니티
            </Link>
            <div className="text-center cursor-pointer hover:text-gray-200">변호사</div>
            <Link to="/notice" className="text-center cursor-pointer hover:text-gray-200 text-white">
              공지사항
            </Link>
            <Link to="/dictionary" className="text-center cursor-pointer hover:text-gray-200 text-gray-800 underline">
              용어사전
            </Link>
            <div className="text-center cursor-pointer hover:text-gray-200">
              고객지원
            </div>
          </nav>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="min-h-[1000px] relative bg-white flex items-stretch">
          <div className="flex">
            {/* 왼쪽 사이드바 */}
            <div className="flex flex-col">
              {isLoggedIn ? <LoggedInSidebar /> : <GuestSidebar />}
            </div>

            {/* 중앙 메인 컨텐츠 */}
            <div className="w-[1020px] h-auto">
              {/* 상단 구분선 */}
              <div className="bg-[#d9d9d9] h-[10px] w-full" />

              <div className="px-[30px] flex-1">
                {/* 뒤로가기 제목 */}
                <div className="py-[10px] h-[65px] flex items-center">
                  <h1
                    className="text-[30px] font-bold text-black cursor-pointer hover:text-gray-700"
                    onClick={() => navigate('/dictionary')}
                  >
                    ←법률사전
                  </h1>
                </div>

                {/* 초성 필터 */}
                <div className="h-[50px] flex items-center justify-center gap-[10px] px-[205px]">
                  {consonants.map((consonant) => (
                    <button
                      key={consonant}
                      onClick={() => setSelectedConsonant(consonant)}
                      className={`w-[30px] h-[30px] flex items-center justify-center font-bold text-[20px] ${
                        selectedConsonant === consonant
                          ? 'bg-[#9ec3e5] text-black shadow-[3px_3px_3px_0px_rgba(0,0,0,0.55)]'
                          : 'bg-white text-black border border-black'
                      }`}
                    >
                      {consonant}
                    </button>
                  ))}
                </div>

                {/* 검색 박스 */}
                <div className="h-[65px] flex items-center justify-center px-[241.5px] py-[10px]">
                  <div className="bg-[#d9d9d9] rounded-[10px] flex items-center justify-between px-[10px] w-[477px] h-[45px]">
                    <input
                      type="text"
                      value={termData.term}
                      placeholder="검색어를 입력 하세요!"
                      className="w-[410px] text-[15px] text-black bg-transparent outline-none"
                      readOnly
                    />
                    <div
                      className="w-[35px] h-[35px] bg-center bg-cover bg-no-repeat cursor-pointer"
                      style={{ backgroundImage: `url('${imgSearch}')` }}
                    />
                  </div>
                </div>

                {/* 용어 설명 박스 */}
                <div className="px-[10px] py-[10px] h-[800px]">
                  {/* 용어 제목 박스 */}
                  <div className="px-[30px] py-[10px] h-[78px] flex items-center">
                    <h2 className="text-[25px] font-bold text-black px-[10px] py-[10px]">
                      {termData.term}
                    </h2>
                  </div>

                  {/* 용어 설명 내용 */}
                  <div className="px-[20px] py-[20px] h-[109px]">
                    <p className="text-[15px] text-black leading-[1.5]">
                      {termData.definition}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-50 bg-[#9ec3e5] h-[100px] flex items-center justify-between px-[50px]">
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
};

export default DictionaryDetailPage;
