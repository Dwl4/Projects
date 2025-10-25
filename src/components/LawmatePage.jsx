import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NoticePage from './NoticePage';  // ✅ 공지사항 컴포넌트 import
import ProfilePage from './ProfilePage';  // ✅ 프로필 컴포넌트 import
import CommunityPage from './CommunityPage';  // ✅ 커뮤니티 컴포넌트 import
import CommunityPostDetail from './CommunityPostDetail';  // ✅ 커뮤니티 상세 컴포넌트 import
import CaseLawContent from './CaseLawContent';  // ✅ 판례 컨텐츠 컴포넌트 import
import { DictionaryContent } from './DictionaryPage';  // ✅ 용어사전 컨텐츠 컴포넌트 import
import SearchResultsContent from './SearchResultsContent';  // ✅ 검색결과 컨텐츠 컴포넌트 import
import LawyerListContent from './LawyerListContent';  // ✅ 변호사 목록 컴포넌트 import
import DictionaryDetailContent from './DictionaryDetailContent';  // ✅ 용어사전 상세 컴포넌트 import
import LawyerProfileContent from './LawyerProfileContent';  // ✅ 변호사 프로필 컴포넌트 import
import LawyerProfileEditContent from './LawyerProfileEditContent';  // ✅ 변호사 프로필 수정 컴포넌트 import
import { demoCaseData } from '../data/demoData';  // ✅ 사건 데이터 import
import { authService, aiChatService } from '../api';  // ✅ API 서비스 import

const imgLawMatrLogo = "/assets/Lawmate_Logo.png";
const imgImage12 = "/assets/Logout_Image.png";
const imgMagnifyingLens = "/assets/Search.png";
const imgImage14 = "/assets/Login_Image.png";

export default function LawmatePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Index');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // URL 경로에서 현재 섹션 결정
  const getActiveSectionFromPath = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/case-law') return 'case-law';
    if (path === '/community') return 'community';
    if (path === '/community-post') return 'communityPost';
    if (path === '/notice') return 'notice';
    if (path === '/dictionary') return 'dictionary';
    if (path.startsWith('/dictionary/')) return 'dictionary-detail';
    if (path === '/profile') return 'profile';
    if (path === '/search-results') return 'search-results';
    if (path === '/lawyer-list') return 'lawyer-list';
    if (path === '/lawyer-profile') return 'lawyer-profile';
    if (path === '/lawyer-profile-edit') return 'lawyer-profile-edit';
    return 'home';
  };

  const [activeSection, setActiveSection] = useState(getActiveSectionFromPath());

  useEffect(() => {
    // API를 통해 현재 로그인한 사용자 정보 가져오기
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('access_token');

      if (token) {
        try {
          const userData = await authService.getCurrentUser();

          // 사용자 정보 업데이트
          setIsLoggedIn(true);

          // user_type에 따라 적절한 이름 필드 사용
          const userType = localStorage.getItem('user_type');
          if (userType === 'lawyer') {
            setUserName(userData.name || 'Index');
            localStorage.setItem('isLawyer', 'true');
          } else {
            setUserName(userData.nickname || userData.name || 'Index');
            localStorage.setItem('isLawyer', 'false');
          }

          // localStorage에 사용자 정보 저장
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', userData.nickname || userData.name || 'Index');
          localStorage.setItem('currentUser', JSON.stringify(userData));
        } catch (error) {
          console.error('사용자 정보 가져오기 실패:', error);
          // 토큰이 유효하지 않으면 로그아웃 처리
          if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_type');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLawyer');
            setIsLoggedIn(false);
            setUserName('Index');
          }
        }
      } else {
        // 토큰이 없으면 로그아웃 상태로 설정
        setIsLoggedIn(false);
        setUserName('Index');
      }
    };

    fetchCurrentUser();
  }, []);

  // URL 경로 변경 시 activeSection 업데이트
  useEffect(() => {
    setActiveSection(getActiveSectionFromPath());
  }, [location.pathname]);

  // 사건 기록 상태 (상위 컴포넌트로 이동)
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // 채팅 세션 목록 가져오기 (한 번만 실행)
  useEffect(() => {
    const fetchSessions = async () => {
      const isLawyer = localStorage.getItem('isLawyer') === 'true';

      // 변호사가 아니고 로그인되어 있으면 세션 조회
      if (!isLawyer && isLoggedIn) {
        try {
          setSessionsLoading(true);
          const data = await aiChatService.getMySessions(1, 5); // 최대 5개만 표시
          setSessions(data.items || []);
        } catch (error) {
          console.error('세션 목록 조회 실패:', error);
          setSessions([]);
        } finally {
          setSessionsLoading(false);
        }
      }
    };

    fetchSessions();
  }, [isLoggedIn]); // isLoggedIn만 의존성으로

  // 로그인된 사용자를 위한 사이드바 컴포넌트
  const LoggedInSidebar = () => {
    // 변호사 여부 확인
    const isLawyer = localStorage.getItem('isLawyer') === 'true';

    // 현재 사용자 정보에서 프로필 이미지 가져오기
    const currentUserData = localStorage.getItem('currentUser');
    const profileImageUrl = currentUserData ? JSON.parse(currentUserData).profile_image_url : null;

    // 변호사면 빈 배열, 일반 사용자면 API에서 가져온 세션 사용
    const caseData = isLawyer ? [] : sessions;

    return (
    <>
      {/* 로그인된 사용자 프로필 섹션 */}
      <aside className="w-[300px] bg-[#95b1d4] h-[300px] flex flex-col items-center justify-center p-[30px]">
        <div className="w-[240px] h-[150px] flex items-center justify-center">
          <div className="w-[150px] h-[150px] relative">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
              <div
                className="w-full h-full bg-center bg-cover bg-no-repeat"
                style={{ backgroundImage: `url('${profileImageUrl || imgImage12}')` }}
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
            onClick={() => {
              // 변호사 여부 확인
              const isLawyer = localStorage.getItem('isLawyer') === 'true';
              if (isLawyer) {
                navigate("/lawyer-profile");
              } else {
                navigate("/profile");
              }
            }}
          >
            프로필
          </button>
          <button
            className="w-[200px] h-[31px] bg-white rounded-[5px] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] font-bold text-[#08213b] text-[15px]"
            onClick={() => {
              // authService.logout()으로 모든 토큰 및 사용자 정보 제거
              authService.logout();

              // 추가 localStorage 값 제거
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("userName");
              localStorage.removeItem("currentUser");
              localStorage.removeItem("isLawyer");

              // 상태 업데이트
              setIsLoggedIn(false);
              setUserName("Index");

              // 커스텀 이벤트 발생시켜서 다른 컴포넌트들에게 로그아웃 알림
              window.dispatchEvent(new Event('localStorageChange'));
            }}
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* 최근사건 기록 섹션 */}
      <div className="w-[300px] bg-white border-r-[5px] border-[#d9d9d9] h-full">
        <div className="">
          <div className="flex items-center justify-between my-[5px]">
            <h3 className="text-[15px] font-bold text-[#03345a] pl-[30px]">최근사건 기록</h3>
            <span className="text-[15px] font-bold text-[#03345a] pr-[30px]">{caseData.length}/5</span>
          </div>
          <div className="w-[150px] h-[3px] bg-[#d9d9d9]" />

          {/* 사건 목록 */}
          <div className="space-y-[0px]">
            {sessionsLoading ? (
              <div className="py-[20px] px-[30px]">
                <p className="text-[13px] text-[#787878] font-bold text-center">로딩 중...</p>
              </div>
            ) : caseData.length > 0 ? (
              caseData.map((session, index) => (
                <React.Fragment key={session.session_uuid}>
                  <div className="py-[14.5px] pr-[15px]">
                    <div className="mb-[8px]">
                      <span className="text-[16px] font-bold text-black pl-[30px]">사건{index + 1}.</span>
                    </div>
                    <div className="pl-[20px]">
                      <p className="text-[12px] text-black leading-[1.5] pl-[30px]">{session.title}</p>
                      {session.legal_category && (
                        <p className="text-[10px] text-[#787878] pl-[30px] mt-[4px]">{session.legal_category}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-[295px] h-[3px] bg-[#d9d9d9] mb-[16px]" />
                </React.Fragment>
              ))
            ) : (
              <div className="py-[20px] px-[30px]">
                <p className="text-[13px] text-[#787878] font-bold text-center">최근 사건 기록이 존재하지 않습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
    );
  };

  // 로그인되지 않은 사용자를 위한 사이드바 컴포넌트
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

      {/* 로그인 안내 섹션 */}
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
      {/* 1600px 컨테이너, 중앙 정렬 */}
      <div className="w-[1320px] mx-auto">
        {/* 네비게이션 */}
        <header className="bg-[#9ec3e5] flex items-center justify-between pl-[30px] pr-[100px] py-[10px] h-20">
          <div
            className="w-[238px] h-20 bg-left bg-no-repeat bg-cover"
            style={{ backgroundImage: `url('${imgLawMatrLogo}')`,
            cursor: "pointer"  // ✅ 여기 추가
           }}
            onClick={() => navigate("/")}   // ✅ 로고 클릭 시 home으로 돌아감
          />
          <nav className="flex items-center gap-[64px] text-white font-bold text-[16px]">
            <div
              className={`text-center cursor-pointer hover:text-gray-200 ${
                activeSection === "home" ? "text-gray-800" : "text-white"
              }`}
              onClick={() => navigate("/")}
            >
              홈
            </div>
            <div
              className={`text-center cursor-pointer hover:text-gray-200 ${
                activeSection === "case-law" ? "text-gray-800" : "text-white"
              }`}
              onClick={() => navigate("/case-law")}
            >
              판례
            </div>
            <div
              className={`text-center cursor-pointer hover:text-gray-200 ${
                activeSection === "community" ? "text-gray-800" : "text-white"
              }`}
              onClick={() => navigate("/community")}
            >
              커뮤니티
            </div>
            <div
              className={`text-center cursor-pointer hover:text-gray-200 ${
                activeSection === "lawyer-list" ? "text-gray-800" : "text-white"
              }`}
              onClick={() => navigate('/lawyer-list')}
            >
              변호사
            </div>
            <div
              className={`text-center cursor-pointer hover:text-gray-200 ${
                activeSection === "notice" ? "text-gray-800" : "text-white"
              }`}
              onClick={() => navigate("/notice")}
            >
              공지사항
            </div>
            <div
              className={`text-center cursor-pointer hover:text-gray-200 ${
                activeSection === "dictionary" ? "text-gray-800" : "text-white"
              }`}
              onClick={() => navigate("/dictionary")}
            >
              용어사전
            </div>
          </nav>
        </header>

        {/* 메인 컨텐츠 */}
        <main className="min-h-[1000px] relative bg-white flex items-stretch">
          <div className="flex">
            {/* 왼쪽 사이드바 - 로그인 상태에 따라 다른 컴포넌트 렌더링 */}
            <div className="flex flex-col">
              {isLoggedIn ? <LoggedInSidebar /> : <GuestSidebar />}
            </div>

            {/* 중앙 메인 컨텐츠 */}
            <div className="w-[1020px] h-auto">
              {/* 상단 회색 바*/}
              <div className="w-full h-[10px] bg-[#d9d9d9]" />
              {activeSection === "home" && (
                <>
              {/* 설명 섹션 */}
              <section className="text-center px-[235px] py-[40px] bg-white">
                <h1 className="text-[32px] font-bold text-[#454545] mb-[16px]">
                  "어려운 법, 친구처럼 쉽게 알려줄게요."<br />
                  AI와 함께하는 법률 정보 플랫폼, Lawmate.
                </h1>
                <p className="text-[15px] text-[#7b7b7b] leading-[1.5]">
                  Lawmate는 어려운 법률 용어와 복잡한 절차를 쉽게 풀어드립니다.<br />
                  누구나 자연어로 질문하면, AI가 관련 법령과 판례를 찾아드리고<br />
                  필요할 경우, 등록된 변호사 정보를 통해 추가 상담도 안내합니다.<br />
                  <br />
                  당신의 법률 고민, 이제 혼자 해결하지 마세요.<br />
                  Lawmate가 법률 친구가 되어드립니다.
                </p>
              </section>

              {/* 검색 섹션 */}
              <section className="flex justify-center px-[250px] pb-[50px]">
                <div className="relative">
                  <div className="w-[738px] h-[50px] bg-[#d9d9d9] relative">
                    <div className="w-[738px] h-[50px] bg-[#d9d9d9] shadow-[5px_6px_0px_#95b1d4]" />

                      {/* 입력창 */}
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && searchQuery.trim()) {
                            navigate('/search-results', { state: { initialQuery: searchQuery } });
                          }
                        }}
                        placeholder="궁금한 사항을 물어봐 주세요!"
                        className="absolute left-[16px] top-1/2 transform -translate-y-1/2
                                   w-[680px] h-[35px] bg-transparent outline-none text-[16px] text-[#333]"
                      />

                      {/* 돋보기 아이콘 */}
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div
                          className="w-10 h-10 bg-center bg-cover bg-no-repeat cursor-pointer hover:opacity-80"
                          style={{ backgroundImage: `url('${imgMagnifyingLens}')` }}
                          onClick={() => {
                            if (searchQuery.trim()) {
                              navigate('/search-results', { state: { initialQuery: searchQuery } });
                            }
                          }}
                        />
                      </div>
                  </div>
                </div>
              </section>

              {/* 구분선 */}
              <div className="w-[600px] h-px bg-[#bcbcbc] mx-auto mb-[39px]" />

              {/* 용어 팁 섹션 */}
              <section className="px-[43px] pt-[50px] py-[70px]">
                <h2 className="text-[16px] font-bold text-[#4b4b4b] mb-[26px]">용어 팁!</h2>
                <div className="grid grid-cols-3 gap-[27px]">
                  <div className="bg-white border-2 border-[#9e9e9e] rounded-[10px] px-[20px] py-[12px] h-[100px]">
                    <h3 className="font-bold text-[14px] text-black mb-[4px]">공포 :</h3>
                    <p className="text-[11px] text-black leading-[normal]">
                      법령을 일반국민에게 널리 알리는 행위를 말한다.<br />
                      법률은 특별한 규정이 없는 한 공포한 날로부터<br />
                      20일을 경과함으로써 효력을 발생한다.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-[#9e9e9e] rounded-[10px] px-[20px] py-[12px] h-[100px]">
                    <h3 className="font-bold text-[14px] text-black mb-[4px]">훈령 :</h3>
                    <p className="text-[11px] text-black leading-[normal]">
                      요약 상급관청이 하급관청의 권한행사를 지시하기<br />
                      위해 하는 일반적 형식의 명령.
                    </p>
                  </div>
                  <div className="bg-white border-2 border-[#9e9e9e] rounded-[10px] px-[20px] py-[12px] h-[100px]">
                    <h3 className="font-bold text-[14px] text-black mb-[8px]">소멸시효 :</h3>
                    <p className="text-[11px] text-black leading-[normal]">
                      일정 시간이 지나면 권리를 행사할 수 없게 되는<br />
                      제도
                    </p>
                  </div>
                </div>
              </section>
                </>
              )}

              {activeSection === "notice" && (
                <NoticePage />  /* ✅ 공지사항 페이지로 교체 */
              )}

              {activeSection === "profile" && (
                <ProfilePage />  /* ✅ 프로필 페이지로 교체 */
              )}

              {activeSection === "community" && (
                <CommunityPage onPostClick={() => navigate("/community-post")} />  /* ✅ 커뮤니티 페이지로 교체 */
              )}

              {activeSection === "communityPost" && (
                <CommunityPostDetail />  /* ✅ 커뮤니티 게시글 상세 페이지로 교체 */
              )}

              {activeSection === "case-law" && (
                <CaseLawContent />  /* ✅ 판례 컨텐츠로 교체 */
              )}

              {activeSection === "dictionary" && (
                <DictionaryContent />  /* ✅ 용어사전 컨텐츠로 교체 */
              )}

              {activeSection === "dictionary-detail" && (
                <DictionaryDetailContent />  /* ✅ 용어사전 상세 컨텐츠로 교체 */
              )}

              {activeSection === "search-results" && (
                <SearchResultsContent />  /* ✅ 검색 결과 컨텐츠로 교체 */
              )}

              {activeSection === "lawyer-list" && (
                <LawyerListContent />  /* ✅ 변호사 목록 컨텐츠로 교체 */
              )}

              {activeSection === "lawyer-profile" && (
                <LawyerProfileContent />  /* ✅ 변호사 프로필 컨텐츠로 교체 */
              )}

              {activeSection === "lawyer-profile-edit" && (
                <LawyerProfileEditContent />  /* ✅ 변호사 프로필 수정 컨텐츠로 교체 */
              )}
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
}