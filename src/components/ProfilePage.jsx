import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoProfileUser, demoCaseData, demoLawyerProfiles } from '../data/demoData';
import { authService, userService, aiChatService } from '../api';

const imgImage12 = "/assets/Logout_Image.png"; // 기본 프로필 이미지 (사람 아이콘)
const imgImage14 = "/assets/Login_Image.png";
const imgImage17 = "/assets/haein.png";
const imgImage20 = "/assets/favorite.png";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('사건');

  // localStorage에서 현재 사용자 정보 가져오기
  const getCurrentUser = () => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : demoProfileUser;
  };

  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // 사건 기록 상태
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // localStorage에서 즐겨찾기 불러오기
  const getFavoritesFromStorage = () => {
    const stored = localStorage.getItem('lawyerFavorites');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  };

  const [favorites, setFavorites] = useState(getFavoritesFromStorage());
  const [favoriteOrder, setFavoriteOrder] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [editedNickname, setEditedNickname] = useState(currentUser.nickname);

  // API를 통해 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setCurrentUser(userData);
        setEditedNickname(userData.nickname || userData.name);

        // 프로필 이미지 URL이 있으면 설정
        if (userData.profile_image_url) {
          setProfileImagePreview(userData.profile_image_url);
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    };

    fetchUserData();
  }, []);

  // 사건 기록(채팅 세션) 가져오기
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setSessionsLoading(true);
        const data = await aiChatService.getMySessions(1, 20); // 전체 목록 조회
        setSessions(data.items || []);
      } catch (error) {
        console.error('세션 목록 조회 실패:', error);
        setSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      // 이미지 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // 이미지를 선택하면 즉시 업로드
      try {
        const formData = new FormData();
        formData.append('profile_image', file);

        // 기존 사용자 정보 추가 (필수 필드)
        if (currentUser.name) {
          formData.append('name', currentUser.name);
        }
        if (currentUser.nickname) {
          formData.append('nickname', currentUser.nickname);
        }
        if (currentUser.phone) {
          formData.append('phone', currentUser.phone);
        }
        if (currentUser.address) {
          formData.append('address', currentUser.address);
        }

        const updatedUser = await userService.updateCurrentUser(formData);

        // 상태 업데이트
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // 사이드바 업데이트를 위한 이벤트 발생
        window.dispatchEvent(new Event('localStorageChange'));

        alert('프로필 이미지가 업데이트되었습니다.');
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
        // 실패 시 미리보기 초기화
        setProfileImage(null);
        setProfileImagePreview(null);
      }
    }
  };

  const handleSaveProfile = async () => {
    // 비밀번호 확인
    if (newPassword && newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const formData = new FormData();

      // 프로필 이미지가 있으면 추가
      if (profileImage) {
        formData.append('profile_image', profileImage);
      }

      // 닉네임 추가
      if (editedNickname && editedNickname !== currentUser.nickname) {
        formData.append('nickname', editedNickname);
      }

      // 이름 추가 (필요시)
      if (currentUser.name) {
        formData.append('name', currentUser.name);
      }

      // 전화번호 추가 (필요시)
      if (currentUser.phone) {
        formData.append('phone', currentUser.phone);
      }

      // 주소 추가 (필요시)
      if (currentUser.address) {
        formData.append('address', currentUser.address);
      }

      // API 호출
      const updatedUser = await userService.updateCurrentUser(formData);

      // 상태 업데이트
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem('userName', updatedUser.nickname || updatedUser.name);

      alert('정보가 저장되었습니다.');

      // 비밀번호 입력 필드 초기화
      setNewPassword('');
      setConfirmPassword('');
      setIsEditMode(false);

      // 사이드바 업데이트를 위한 이벤트 발생
      window.dispatchEvent(new Event('localStorageChange'));
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      alert('프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const toggleFavorite = (lawyerId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(lawyerId)) {
        newFavorites.delete(lawyerId);
        // 즐겨찾기 해제시 순서에서도 제거
        setFavoriteOrder(prevOrder => prevOrder.filter(id => id !== lawyerId));
      } else {
        newFavorites.add(lawyerId);
        // 즐겨찾기 추가시 가장 앞으로 이동
        setFavoriteOrder(prevOrder => [lawyerId, ...prevOrder.filter(id => id !== lawyerId)]);
      }
      // localStorage에 저장
      localStorage.setItem('lawyerFavorites', JSON.stringify(Array.from(newFavorites)));
      return newFavorites;
    });
  };

  const handleInquiry = () => {
    console.log('문의 등록 클릭');
  };

  const openMapSearch = () => {
    window.open('https://map.kakao.com/', '_blank');
  };

  const handleWithdraw = () => {
    if (window.confirm('정말로 회원 탈퇴하시겠습니까?')) {
      console.log('회원 탈퇴 처리');
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 2;
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-[1020px] mx-auto">
        {/* 메인 섹션 */}
        <div className="bg-[#f8f9fa] flex flex-col gap-[50px] px-[50px] py-[30px] min-h-screen">
              {/* 환영 문구 */}
              <div className="flex flex-col items-start justify-center w-full">
                <div className="flex font-bold items-center text-[30px] text-black">
                  <span>{currentUser.nickname}</span>
                  <span>님 환영합니다</span>
                </div>
                <span className="font-light text-[20px] text-black">마이페이지에서 회원정보를 관리하실 수 있습니다.</span>
              </div>

              {/* 조건부 렌더링: 일반 모드 vs 수정 모드 */}
              {!isEditMode ? (
                <>
              {/* 프로필 박스 */}
              <div className="bg-[#e8e8e8] flex h-[250px] items-center justify-between rounded-[10px] shadow-[2px_2px_5px_0px_rgba(0,0,0,0.25)] w-full">
                {/* 이미지 박스 */}
                <div className="flex flex-col gap-[20px] h-full items-center justify-center px-[45px] py-[20px]">
                  <div className="relative w-[150px] h-[150px]">
                    <div
                      className="w-[150px] h-[150px] bg-cover bg-center rounded-full"
                      style={{
                        backgroundImage: `url('${profileImagePreview || currentUser.profile_image_url || imgImage12}')`,
                      }}
                    />
                  </div>
                  <label className="bg-white flex items-center justify-center px-[20px] py-[3px] rounded-[5px] cursor-pointer hover:opacity-80">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <span className="font-bold text-[#08213b] text-[15px]">이미지 수정</span>
                  </label>
                </div>

                {/* 구분선 */}
                <div className="bg-white h-[200px] w-[3px]" />

                {/* 개인정보 박스 */}
                <div className="flex gap-[30px] flex-1 h-full items-center px-[30px] py-[10px]">
                  {/* 라벨 */}
                  <div className="flex flex-col gap-[10px] h-full items-start py-[30px]">
                    <div className="font-normal text-[13px] text-black whitespace-pre-line">
                      이름: <br /><br />
                      이메일:
                    </div>
                  </div>

                  {/* 내용1 */}
                  <div className="flex flex-col gap-[15px] flex-1 h-full items-start py-[30px]">
                    <div className="font-normal text-[13px] text-black whitespace-pre-line">
                      {currentUser.name}<br /><br />
                      {currentUser.email}
                    </div>
                  </div>

                  {/* 라벨2 */}
                  <div className="flex flex-col gap-[10px] h-full items-start py-[30px]">
                    <div className="font-normal text-[13px] text-black whitespace-pre-line">
                      닉네임:<br /><br />
                      주소:
                    </div>
                  </div>

                  {/* 내용2 */}
                  <div className="flex flex-col gap-[10px] flex-1 h-full items-start py-[30px] relative">
                    <div className="font-normal text-[13px] text-black whitespace-pre-line">
                      {currentUser.nickname}<br /><br />
                      {currentUser.address}
                    </div>
                    <div className="absolute bottom-[30px] right-0">
                      <div
                        className="bg-[#9ec3e5] flex items-center justify-center px-[10px] py-[2px] rounded-[5px] cursor-pointer hover:opacity-80"
                        onClick={() => setIsEditMode(true)}
                      >
                        <span className="font-normal text-[13px] text-black">수정 하기</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 기록 박스 */}
              <div className="bg-[#e8e8e8] flex flex-col gap-[20px] flex-1 px-[45px] py-[30px] rounded-[10px] shadow-[2px_2px_5px_0px_rgba(0,0,0,0.25)] w-full">
                {/* 내 기록 헤더 */}
                <div className="flex items-center w-full">
                  <span className="font-bold text-[23px] text-black">내 기록</span>
                </div>

                {/* 사건 변호사 탭 */}
                <div className="flex flex-col items-start p-[10px] w-full">
                  <div className="flex font-bold gap-[50px] items-center p-[10px] text-[10px] w-full">
                    <span
                      className={`cursor-pointer transition-colors duration-300 ${activeTab === '사건' ? 'text-[#7bb5ff]' : 'text-black'}`}
                      onClick={() => setActiveTab('사건')}
                    >
                      사건
                    </span>
                    <span
                      className={`cursor-pointer transition-colors duration-300 ${activeTab === '변호사' ? 'text-[#7bb5ff]' : 'text-black'}`}
                      onClick={() => setActiveTab('변호사')}
                    >
                      변호사
                    </span>
                  </div>
                  <div className="bg-white h-[3px] w-full relative">
                    <div
                      className={`absolute bg-[#7bb5ff] h-[3px] top-0 w-[40px] transition-all duration-300 ${
                        activeTab === '사건' ? 'left-[0px]' : 'left-[71px]'
                      }`}
                    />
                  </div>
                </div>

                {/* 목록 */}
                <div className="flex flex-col gap-[20px] flex-1 w-full">
                  {activeTab === '사건' ? (
                    // 사건 목록
                    sessionsLoading ? (
                      <div className="bg-white flex items-center justify-center px-[30px] py-[40px] rounded-[10px] w-full">
                        <span className="text-[15px] text-[#787878]">로딩 중...</span>
                      </div>
                    ) : sessions.length > 0 ? (
                      sessions.map((session, index) => (
                        <div key={session.session_uuid} className="bg-white flex flex-col gap-[10px] px-[30px] py-[20px] rounded-[10px] w-full">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold text-[23px] text-black max-w-[670px] truncate">{session.title}</span>
                            {session.legal_category && (
                              <span className="text-[13px] text-[#787878] font-normal">{session.legal_category}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between px-[10px] py-[6px] w-full">
                            <div className="flex flex-col gap-[5px]">
                              <span className="font-light text-[13px] text-black">
                                {new Date(session.created_at).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <span className="font-light text-[11px] text-[#787878]">
                                메시지 {session.message_count || 0}개
                              </span>
                            </div>
                            <div
                              className="bg-[#9ec3e5] flex items-center justify-center px-[10px] py-[5px] rounded-[5px] cursor-pointer hover:opacity-80"
                              onClick={() => {
                                // TODO: 대화 내용 확인 페이지로 이동
                                console.log('세션 UUID:', session.session_uuid);
                              }}
                            >
                              <span className="font-normal text-[10px] text-black">대화내용 확인</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white flex items-center justify-center px-[30px] py-[40px] rounded-[10px] w-full">
                        <span className="text-[15px] text-[#787878]">사건 기록이 없습니다.</span>
                      </div>
                    )
                  ) : (
                    // 변호사 목록 (Figma 디자인과 동일)
                    <div
                      className="flex gap-[35px] overflow-x-auto cursor-grab active:cursor-grabbing select-none pb-[20px]"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                    >
                      {demoLawyerProfiles.filter(lawyer => favorites.has(lawyer.id)).map((lawyer) => (
                        <div key={lawyer.id} className="bg-[#d9d9d9] flex flex-col gap-[10px] h-[500px] items-start px-[10px] py-[15px] rounded-[10px] w-[250px]">
                          {/* 이미지와 소개 */}
                          <div className="flex items-start justify-between w-full">
                            {/* 소개글 */}
                            <div className="flex flex-col items-start self-stretch">
                              <div className="font-normal text-[11px] text-black w-[100px] h-[160px] leading-normal overflow-hidden">
                                {lawyer.introduction}
                              </div>
                            </div>
                            {/* 이미지 */}
                            <div className="h-[160px] overflow-hidden relative w-[120px]">
                              <div className="absolute left-0 top-0">
                                <div
                                  className="absolute bg-center bg-cover bg-no-repeat h-[160px] w-[120px] rounded-[5px] top-0"
                                  style={{
                                    backgroundImage: `url('${lawyer.image}')`
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 변호사 이름 */}
                          <div className="flex gap-[10px] items-center justify-end px-[20px] text-black w-full">
                            <div className="font-normal text-[11px]">변호사</div>
                            <div className="font-bold text-[15px]">{lawyer.name}</div>
                          </div>

                          {/* 전문분야 */}
                          <div className="flex flex-col gap-[10px] items-start justify-center w-full">
                            {/* 제목 */}
                            <div className="flex items-center">
                              <div className="font-bold text-[12px] text-black">전문 분야</div>
                            </div>
                                                          
                            {/* 내용 */}
                            <div className="font-normal grid grid-cols-2 gap-y-[5px] text-[10px] w-full">
                              {lawyer.specialties.map((spec, idx) => (
                                <div key={idx} className="text-black w-[110px]">
                                  <ul className="list-disc ml-[15px]">
                                    <li>{spec}</li>
                                  </ul>
                                </div>
                              ))}
                              {/* 나머지 개수 */}
                              <div className="text-[#787878] w-[110px] pl-[20px]">
                                외 {lawyer.specialtyCount}개
                              </div>
                            </div>
                          </div>

                          {/* 주요 경력 */}
                          <div className="flex flex-col gap-[10px] items-start w-full">
                            <div className="flex items-center">
                              <div className="font-bold text-[12px] text-black">주요 경력</div>
                            </div>
                            <div className="flex flex-col font-normal gap-[5px] items-start text-[10px] w-[230px]">
                              {lawyer.experience.map((exp, idx) => (
                                <div key={idx} className="text-black">
                                  <ul className="list-disc ml-[15px]">
                                    <li>{exp}</li>
                                  </ul>
                                </div>
                              ))}
                              <div className="text-[#787878] pl-[20px]">외 5개</div>
                            </div>
                          </div>

                          {/* 활동 지역 */}
                          <div className="flex flex-col gap-[10px] items-start w-full">
                            <div className="flex items-center">
                              <div className="font-bold text-[12px] text-black">활동 지역</div>
                            </div>
                            <div className="flex flex-col gap-[5px] items-start w-[230px]">
                              <div className="font-normal text-[10px] text-black">
                                <ul className="list-disc ml-[15px]">
                                  <li>서울·경기·온라인 상담 가능</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* 즐겨찾기 및 상담하기 버튼 */}
                          <div className="flex grow items-center justify-between pl-[10px] w-full min-h-0">
                            <button
                              onClick={() => toggleFavorite(lawyer.id)}
                              className="size-[25px] bg-center bg-cover bg-no-repeat cursor-pointer hover:opacity-80 transition-opacity"
                              style={{
                                backgroundImage: `url('${imgImage20}')`
                              }}
                            />
                            <div className="font-bold text-[10px] text-black cursor-pointer hover:underline">
                              상담하러 가기 →
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
                </>
              ) : (
                // 수정 모드 - 원본 구조와 완전히 동일하게 유지
                <>
              {/* 프로필 박스 */}
              <div className="bg-[#e8e8e8] flex h-[250px] items-center justify-between rounded-[10px] shadow-[2px_2px_5px_0px_rgba(0,0,0,0.25)] w-full relative">
                {/* 회원 탈퇴 버튼 - 오른쪽 위 */}
                <button
                  onClick={handleWithdraw}
                  className="absolute top-[10px] right-[30px] text-[13px] font-bold text-[#ff3333] hover:underline cursor-pointer"
                >
                  회원 탈퇴
                </button>

                {/* 이미지 박스 */}
                <div className="flex flex-col gap-[20px] h-full items-center justify-center px-[45px] py-[20px]">
                  <div className="relative w-[150px] h-[150px]">
                    <div
                      className="w-[150px] h-[150px] bg-cover bg-center rounded-full"
                      style={{
                        backgroundImage: `url('${profileImagePreview || currentUser.profile_image_url || imgImage12}')`,
                      }}
                    />
                  </div>
                  <label className="bg-white flex items-center justify-center px-[20px] py-[3px] rounded-[5px] cursor-pointer hover:opacity-80">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <span className="font-bold text-[#08213b] text-[15px]">이미지 수정</span>
                  </label>
                </div>

                {/* 구분선 */}
                <div className="bg-white h-[200px] w-[3px]" />

                {/* 개인정보 박스 */}
                <div className="flex gap-[30px] flex-1 h-full items-center px-[30px] py-[10px]">
                  {/* 라벨 */}
                  <div className="flex flex-col gap-[10px] h-full items-start py-[30px]">
                    <div className="font-normal text-[13px] text-black whitespace-pre-line">
                      이름: <br /><br />
                      이메일:<br /><br />
                      비밀번호 변경:<br /><br />
                      비밀번호 확인:
                    </div>
                  </div>

                  {/* 내용1 */}
                  <div className="flex flex-col gap-[15px] flex-1 h-full items-start py-[30px]">
                    <div className="font-normal text-[13px] text-black whitespace-pre-line">
                      {currentUser.name}<br /><br />
                      {currentUser.email}
                    </div>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="새 비밀번호"
                        className="bg-white h-[20px] w-[130px] border border-gray-300 rounded px-[5px] pr-[25px] text-[10px] focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="block absolute right-[5px] transform -translate-y-[110%] h-[16px] w-[16px] flex items-center justify-center text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호 확인"
                        className="bg-white h-[20px] w-[130px] border border-gray-300 rounded px-[5px] pr-[25px] text-[10px] focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-[5px] transform -translate-y-[110%] h-[16px] w-[16px] flex items-center justify-center text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 라벨2 */}
                  <div className="flex flex-col gap-[10px] h-full items-start py-[30px]">
                    <div className="font-normal text-[13px] text-black whitespace-pre-line">
                      닉네임:<br /><br />
                      주소:
                    </div>
                  </div>

                  {/* 내용2 */}
                  <div className="flex flex-col gap-[10px] flex-1 h-full items-start py-[30px] relative">
                    <input
                      type="text"
                      value={editedNickname}
                      onChange={(e) => setEditedNickname(e.target.value)}
                      className="bg-white h-[20px] w-[130px] border border-gray-300 rounded px-[5px] text-[10px] focus:outline-none focus:border-blue-500"
                    />
                    <div className="mb-[10px]">
                      <div
                        className="bg-white px-[13px] py-[2px] shadow-[2px_2px_1px_0px_rgba(0,0,0,0.25)] inline-block cursor-pointer hover:opacity-80"
                        onClick={openMapSearch}
                      >
                        <span className="font-normal text-[13px] text-black">길찾기</span>
                      </div>
                    </div>
                    <div className="absolute bottom-[30px] right-0 flex gap-[10px]">
                      <div
                        className="bg-white flex items-center justify-center px-[10px] py-[2px] rounded-[5px] cursor-pointer hover:opacity-80 shadow-[2px_2px_1px_0px_rgba(0,0,0,0.25)]"
                        onClick={() => setIsEditMode(false)}
                      >
                        <span className="font-normal text-[13px] text-black">돌아가기</span>
                      </div>
                      <div
                        className="bg-[#9ec3e5] flex items-center justify-center px-[10px] py-[2px] rounded-[5px] cursor-pointer hover:opacity-80"
                        onClick={handleSaveProfile}
                      >
                        <span className="font-normal text-[13px] text-black">저장하기</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 기록 박스 */}
              <div className="bg-[#e8e8e8] flex flex-col gap-[20px] flex-1 px-[45px] py-[30px] rounded-[10px] shadow-[2px_2px_5px_0px_rgba(0,0,0,0.25)] w-full">
                {/* 내 기록 헤더 */}
                <div className="flex items-center w-full">
                  <span className="font-bold text-[23px] text-black">내 기록</span>
                </div>

                {/* 사건 변호사 탭 */}
                <div className="flex flex-col items-start p-[10px] w-full">
                  <div className="flex font-bold gap-[50px] items-center p-[10px] text-[10px] w-full">
                    <span
                      className={`cursor-pointer transition-colors duration-300 ${activeTab === '사건' ? 'text-[#7bb5ff]' : 'text-black'}`}
                      onClick={() => setActiveTab('사건')}
                    >
                      사건
                    </span>
                    <span
                      className={`cursor-pointer transition-colors duration-300 ${activeTab === '변호사' ? 'text-[#7bb5ff]' : 'text-black'}`}
                      onClick={() => setActiveTab('변호사')}
                    >
                      변호사
                    </span>
                  </div>
                  <div className="bg-white h-[3px] w-full relative">
                    <div
                      className={`absolute bg-[#7bb5ff] h-[3px] top-0 w-[40px] transition-all duration-300 ${
                        activeTab === '사건' ? 'left-[0px]' : 'left-[71px]'
                      }`}
                    />
                  </div>
                </div>

                {/* 목록 */}
                <div className="flex flex-col gap-[20px] flex-1 w-full">
                  {activeTab === '사건' ? (
                    // 사건 목록
                    sessionsLoading ? (
                      <div className="bg-white flex items-center justify-center px-[30px] py-[40px] rounded-[10px] w-full">
                        <span className="text-[15px] text-[#787878]">로딩 중...</span>
                      </div>
                    ) : sessions.length > 0 ? (
                      sessions.map((session, index) => (
                        <div key={session.session_uuid} className="bg-white flex flex-col gap-[10px] px-[30px] py-[20px] rounded-[10px] w-full">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold text-[23px] text-black max-w-[670px] truncate">{session.title}</span>
                            {session.legal_category && (
                              <span className="text-[13px] text-[#787878] font-normal">{session.legal_category}</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between px-[10px] py-[6px] w-full">
                            <div className="flex flex-col gap-[5px]">
                              <span className="font-light text-[13px] text-black">
                                {new Date(session.created_at).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <span className="font-light text-[11px] text-[#787878]">
                                메시지 {session.message_count || 0}개
                              </span>
                            </div>
                            <div
                              className="bg-[#9ec3e5] flex items-center justify-center px-[10px] py-[5px] rounded-[5px] cursor-pointer hover:opacity-80"
                              onClick={() => {
                                // TODO: 대화 내용 확인 페이지로 이동
                                console.log('세션 UUID:', session.session_uuid);
                              }}
                            >
                              <span className="font-normal text-[10px] text-black">대화내용 확인</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white flex items-center justify-center px-[30px] py-[40px] rounded-[10px] w-full">
                        <span className="text-[15px] text-[#787878]">사건 기록이 없습니다.</span>
                      </div>
                    )
                  ) : (
                    // 변호사 목록
                    <div
                      className="flex gap-[35px] overflow-x-auto cursor-grab active:cursor-grabbing select-none pb-[20px]"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                    >
                  {demoLawyerProfiles.filter(lawyer => favorites.has(lawyer.id)).map((lawyer) => (
                    <div key={lawyer.id} className="bg-[#d9d9d9] flex flex-col gap-[10px] h-[500px] items-start px-[10px] py-[15px] rounded-[10px] w-[250px]">
                      {/* 이미지와 소개 */}
                      <div className="flex items-start justify-between w-full">
                        {/* 소개글 */}
                        <div className="flex flex-col items-start self-stretch">
                          <div className="font-normal text-[11px] text-black w-[100px] h-[160px] leading-normal overflow-hidden">
                            {lawyer.introduction}
                          </div>
                        </div>
                        {/* 이미지 */}
                        <div className="h-[160px] overflow-hidden relative w-[120px]">
                          <div className="absolute left-0 top-0">
                            <div
                              className="absolute bg-center bg-cover bg-no-repeat h-[160px] w-[120px] rounded-[5px] top-0"
                              style={{
                                backgroundImage: `url('${lawyer.image}')`
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* 변호사 이름 */}
                      <div className="flex gap-[10px] items-center justify-end px-[20px] text-black w-full">
                        <div className="font-normal text-[11px]">변호사</div>
                        <div className="font-bold text-[15px]">{lawyer.name}</div>
                      </div>

                      {/* 전문분야 */}
                      <div className="flex flex-col gap-[10px] items-start justify-center w-full">
                        {/* 제목 */}
                        <div className="flex items-center">
                          <div className="font-bold text-[12px] text-black">전문 분야</div>
                        </div>

                        {/* 내용 */}
                        <div className="font-normal grid grid-cols-2 gap-y-[5px] text-[10px] w-full">
                          {lawyer.specialties.map((spec, idx) => (
                            <div key={idx} className="text-black w-[110px]">
                              <ul className="list-disc ml-[15px]">
                                <li>{spec}</li>
                              </ul>
                            </div>
                          ))}
                          {/* 나머지 개수 */}
                          <div className="text-[#787878] w-[110px] pl-[20px]">
                            외 {lawyer.specialtyCount}개
                          </div>
                        </div>
                      </div>

                      {/* 주요 경력 */}
                      <div className="flex flex-col gap-[10px] items-start w-full">
                        <div className="flex items-center">
                          <div className="font-bold text-[12px] text-black">주요 경력</div>
                        </div>
                        <div className="flex flex-col font-normal gap-[5px] items-start text-[10px] w-[230px]">
                          {lawyer.experience.map((exp, idx) => (
                            <div key={idx} className="text-black">
                              <ul className="list-disc ml-[15px]">
                                <li>{exp}</li>
                              </ul>
                            </div>
                          ))}
                          <div className="text-[#787878] pl-[20px]">외 5개</div>
                        </div>
                      </div>

                      {/* 활동 지역 */}
                      <div className="flex flex-col gap-[10px] items-start w-full">
                        <div className="flex items-center">
                          <div className="font-bold text-[12px] text-black">활동 지역</div>
                        </div>
                        <div className="flex flex-col gap-[5px] items-start w-[230px]">
                          <div className="font-normal text-[10px] text-black">
                            <ul className="list-disc ml-[15px]">
                              <li>서울·경기·온라인 상담 가능</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* 즐겨찾기 및 상담하기 버튼 */}
                      <div className="flex grow items-center justify-between pl-[10px] w-full min-h-0">
                        <button
                          onClick={() => toggleFavorite(lawyer.id)}
                          className="size-[25px] bg-center bg-cover bg-no-repeat cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            backgroundImage: `url('${imgImage20}')`
                          }}
                        />
                        <div className="font-bold text-[10px] text-black cursor-pointer hover:underline">
                          상담하러 가기 →
                        </div>
                      </div>
                    </div>
                  ))}
                    </div>
                  )}
                </div>
              </div>
                </>
              )}
        </div>
      </div>
    </div>
  );
}