import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoProfileUser, demoCaseData, demoLawyerProfiles } from '../data/demoData';
import { authService, userService, aiChatService, lawyerService } from '../api';

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

  // 즐겨찾기 변호사 목록 상태
  const [favoriteLawyers, setFavoriteLawyers] = useState([]);
  const [favoriteLawyersLoading, setFavoriteLawyersLoading] = useState(false);

  // localStorage에서 즐겨찾기 불러오기
  const getFavoritesFromStorage = () => {
    const stored = localStorage.getItem('lawyerFavorites');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  };

  const [favorites, setFavorites] = useState(getFavoritesFromStorage());
  const [favoriteOrder, setFavoriteOrder] = useState([]);
  const [editedAddress, setEditedAddress] = useState(currentUser.address || '');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [editedNickname, setEditedNickname] = useState(currentUser.nickname);

  // API를 통해 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        console.log('📥 사용자 정보 받음:', userData);

        // profile_image 경로를 완전한 URL로 변환
        if (userData.profile_image && !userData.profile_image.startsWith('http')) {
          const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://54.180.238.189:8001';
          const baseUrl = API_BASE.replace('/api/v1', ''); // /api/v1 제거
          userData.profile_image_url = `${baseUrl}${userData.profile_image}`;
          console.log('✅ 프로필 이미지 URL:', userData.profile_image_url);
        } else {
          userData.profile_image_url = userData.profile_image;
        }

        setCurrentUser(userData);
        setEditedNickname(userData.nickname || userData.name);

        // localStorage에도 저장
        localStorage.setItem('currentUser', JSON.stringify(userData));
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

  // 즐겨찾기 변호사 목록 가져오기
  useEffect(() => {
    const fetchFavoriteLawyers = async () => {
      if (activeTab !== '변호사') return;

      try {
        setFavoriteLawyersLoading(true);
        console.log('🔍 즐겨찾기 변호사 목록 조회...');
        const data = await lawyerService.getMyFavoriteLawyers();
        console.log('✅ 즐겨찾기 변호사 목록:', data);
        setFavoriteLawyers(Array.isArray(data) ? data : []);

        // localStorage에도 즐겨찾기 ID 저장
        const favoriteIds = new Set(data.map(lawyer => lawyer.id));
        setFavorites(favoriteIds);
        localStorage.setItem('lawyerFavorites', JSON.stringify(Array.from(favoriteIds)));
      } catch (error) {
        console.error('❌ 즐겨찾기 목록 조회 실패:', error);
        setFavoriteLawyers([]);
      } finally {
        setFavoriteLawyersLoading(false);
      }
    };

    fetchFavoriteLawyers();
  }, [activeTab]);

  const toggleFavorite = async (lawyerId) => {
    try {
      const isCurrentlyFavorite = favorites.has(lawyerId);

      if (isCurrentlyFavorite) {
        await lawyerService.removeLawyerFromFavorites(lawyerId);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(lawyerId);
          localStorage.setItem('lawyerFavorites', JSON.stringify(Array.from(newFavorites)));
          return newFavorites;
        });
        // 목록에서 제거
        setFavoriteLawyers(prev => prev.filter(lawyer => lawyer.id !== lawyerId));
      } else {
        await lawyerService.addLawyerToFavorites(lawyerId);
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.add(lawyerId);
          localStorage.setItem('lawyerFavorites', JSON.stringify(Array.from(newFavorites)));
          return newFavorites;
        });
      }
    } catch (err) {
      console.error('즐겨찾기 토글 실패:', err);
      alert('즐겨찾기 처리에 실패했습니다.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);

      // 이미지 미리보기만 수행 (저장 버튼 클릭 시 업로드)
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();

      console.log('📤 프로필 업데이트 시작');

      // 프로필 이미지가 있으면 추가
      if (profileImage) {
        formData.append('profile_image', profileImage);
        console.log('✅ 프로필 이미지 추가:', profileImage.name);
      }

      // 닉네임 추가 (항상 포함)
      if (editedNickname) {
        formData.append('nickname', editedNickname);
        console.log('✅ 닉네임 추가:', editedNickname);
      }

      // 이름 추가 (필수)
      if (currentUser.name) {
        formData.append('name', currentUser.name);
      }

      // 전화번호 추가 (있으면)
      if (currentUser.phone) {
        formData.append('phone', currentUser.phone);
      }

      // 주소 추가 (수정된 주소 사용)
      if (editedAddress) {
        formData.append('address', editedAddress);
        console.log('✅ 주소 추가:', editedAddress);
      }

      // FormData 내용 확인
      console.log('📋 FormData 내용:');
      for (let pair of formData.entries()) {
        console.log(pair[0], typeof pair[1] === 'object' ? pair[1] : pair[1]);
      }

      // API 호출
      const updatedUser = await userService.updateCurrentUser(formData);
      console.log('✅ 프로필 업데이트 성공:', updatedUser);

      // profile_image 경로를 완전한 URL로 변환
      if (updatedUser.profile_image && !updatedUser.profile_image.startsWith('http')) {
        const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://54.180.238.189:8001';
        const baseUrl = API_BASE.replace('/api/v1', ''); // /api/v1 제거
        updatedUser.profile_image_url = `${baseUrl}${updatedUser.profile_image}`;
        console.log('✅ 업데이트된 프로필 이미지 URL:', updatedUser.profile_image_url);
      } else {
        updatedUser.profile_image_url = updatedUser.profile_image;
      }

      // 상태 업데이트
      setCurrentUser(updatedUser);
      setProfileImagePreview(null); // 미리보기 초기화 (업데이트된 URL 사용)
      setProfileImage(null); // 이미지 파일 초기화
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      localStorage.setItem('userName', updatedUser.nickname || updatedUser.name);

      // 사이드바 업데이트를 위한 이벤트 발생
      window.dispatchEvent(new Event('localStorageChange'));

      alert('정보가 저장되었습니다.');
      setIsEditMode(false);
    } catch (error) {
      console.error('❌ 프로필 업데이트 실패:', error);
      console.error('에러 상세:', error.response?.data);
      alert('프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleInquiry = () => {
    console.log('문의 등록 클릭');
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        // 지번 주소 우선, 없으면 도로명 주소 사용
        const jibunAddress = data.jibunAddress || data.roadAddress;
        setEditedAddress(jibunAddress);
      }
    }).open();
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
                        backgroundImage: `url('${currentUser.profile_image_url || imgImage12}')`,
                      }}
                    />
                  </div>
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
                <div className="flex flex-col items-start w-full">
                  <div className="flex font-bold gap-[50px] items-center py-[10px] text-[18px] w-full relative">
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
                    {/* 하단 인디케이터 바 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white h-[3px]">
                      <div
                        className={`absolute bg-[#7bb5ff] h-[3px] top-0 transition-all duration-300 ${
                          activeTab === '사건'
                            ? 'left-[0px] w-[36px]'  // "사건" 위치 (공백 없음)
                            : 'left-[81px] w-[54px]'  // "변호사" 위치 (36px + 50px)
                        }`}
                      />
                    </div>
                  </div>
                  {/* 변호사 탭 설명 */}
                  {activeTab === '변호사' && (
                    <div className="mt-[15px]">
                      <p className="text-[14px] text-[#666]">즐겨찾기한 변호사</p>
                    </div>
                  )}
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
                                // 해당 세션의 대화 내역으로 이동
                                navigate('/search-results', {
                                  state: {
                                    sessionUuid: session.session_uuid,
                                  }
                                });
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
                    // 변호사 목록 - LawyerListContent와 동일한 카드 디자인
                    favoriteLawyersLoading ? (
                      <div className="bg-white flex items-center justify-center px-[30px] py-[40px] rounded-[10px] w-full">
                        <span className="text-[15px] text-[#787878]">로딩 중...</span>
                      </div>
                    ) : favoriteLawyers.length > 0 ? (
                      <div className="grid grid-cols-3 gap-[30px] pb-[20px]">
                      {favoriteLawyers.map((lawyer) => {
                        // 프로필 이미지 URL 처리
                        const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://54.180.238.189:8001/api/v1';
                        const baseUrl = API_BASE.replace('/api/v1', '');
                        const profileImageUrl = lawyer.profile_image
                          ? (lawyer.profile_image.startsWith('http')
                              ? lawyer.profile_image
                              : `${baseUrl}${lawyer.profile_image}`)
                          : null;

                        // 전문분야 개수 계산
                        const displayedSpecialties = lawyer.specialties?.slice(0, 4) || [];
                        const remainingSpecialtiesCount = (lawyer.specialties?.length || 0) - displayedSpecialties.length;

                        return (
                        <div key={lawyer.id} className="bg-white rounded-[16px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0px_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col"
                          onClick={() => navigate(`/lawyer-profile/${lawyer.id}`)}
                        >
                          {/* 프로필 이미지 - 세로 황금비율 (1:1.618) */}
                          <div className="relative w-full aspect-[1/1.618] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            {profileImageUrl ? (
                              <img
                                src={profileImageUrl}
                                alt={lawyer.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            )}
                            {/* 즐겨찾기 버튼 */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(lawyer.id);
                              }}
                              className="absolute top-[12px] right-[12px] w-[32px] h-[32px] rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-md z-10"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill={'#ff6b6b'}
                                stroke={'#ff6b6b'}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                              </svg>
                            </button>
                            {/* 인증 배지 */}
                            {lawyer.is_verified && (
                              <div className="absolute top-[12px] left-[12px] bg-blue-500 text-white text-[11px] font-bold px-[10px] py-[4px] rounded-full flex items-center gap-[4px]">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                인증
                              </div>
                            )}
                          </div>

                          {/* 카드 본문 */}
                          <div className="p-[20px] flex flex-col gap-[16px] flex-grow">
                            {/* 변호사 이름 & 법무법인 */}
                            <div className="flex flex-col gap-[6px]">
                              <div className="flex items-center gap-[8px]">
                                <h3 className="text-[20px] font-bold text-[#1a1a1a]">{lawyer.name}</h3>
                                <span className="text-[13px] text-gray-500">변호사</span>
                              </div>
                              <p className="text-[14px] text-gray-600 font-medium">{lawyer.law_firm || '법률사무소'}</p>
                            </div>

                            {/* 전문 분야 */}
                            <div className="flex flex-col gap-[10px]">
                              <p className="text-[13px] font-bold text-gray-700">전문 분야</p>
                              <div className="flex flex-wrap gap-[6px]">
                                {displayedSpecialties.length > 0 ? (
                                  <>
                                    {displayedSpecialties.map((spec, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-gray-100 text-gray-700 text-[12px] px-[12px] py-[6px] rounded-full font-medium"
                                      >
                                        {spec}
                                      </span>
                                    ))}
                                    {remainingSpecialtiesCount > 0 && (
                                      <span className="bg-gray-100 text-gray-500 text-[12px] px-[12px] py-[6px] rounded-full font-medium">
                                        +{remainingSpecialtiesCount}
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-[12px] text-gray-400">전문분야 미등록</span>
                                )}
                              </div>
                            </div>

                            {/* 활동 지역 */}
                            {lawyer.region && (
                              <div className="flex items-center gap-[8px] pt-[8px] border-t border-gray-100">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                  <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span className="text-[13px] text-gray-600">{lawyer.region}</span>
                              </div>
                            )}

                            {/* Spacer - 버튼을 하단으로 밀어내기 */}
                            <div className="flex-grow"></div>

                            {/* 프로필 확인 버튼 - 하단 고정 */}
                            <button
                              className="w-full bg-gradient-to-r from-[#9ec3e5] to-[#7da9d3] hover:from-[#7da9d3] hover:to-[#6b98c2] text-white text-[14px] font-bold py-[12px] rounded-[10px] transition-all duration-200 shadow-[0px_2px_8px_rgba(158,195,229,0.3)] hover:shadow-[0px_4px_12px_rgba(158,195,229,0.4)] flex items-center justify-center gap-[6px]"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/lawyer-profile/${lawyer.id}`);
                              }}
                            >
                              <span>프로필 확인하기</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                              </svg>
                            </button>
                          </div>
                        </div>
                        );
                      })}
                      </div>
                    ) : (
                      <div className="bg-white flex items-center justify-center px-[30px] py-[40px] rounded-[10px] w-full">
                        <span className="text-[15px] text-[#787878]">즐겨찾기한 변호사가 없습니다.</span>
                      </div>
                    )
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
                    <input
                      type="text"
                      value={editedNickname}
                      onChange={(e) => setEditedNickname(e.target.value)}
                      className="bg-white h-[20px] w-[200px] border border-gray-300 rounded px-[5px] text-[10px] focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex flex-col gap-[10px] mb-[10px]">
                      <input
                        type="text"
                        value={editedAddress}
                        onChange={(e) => setEditedAddress(e.target.value)}
                        placeholder="주소"
                        className="bg-white h-[20px] w-[200px] border border-gray-300 rounded px-[5px] text-[10px] focus:outline-none focus:border-blue-500"
                        readOnly
                      />
                      <div
                        className="bg-white px-[13px] py-[2px] shadow-[2px_2px_1px_0px_rgba(0,0,0,0.25)] inline-block cursor-pointer hover:opacity-80"
                        onClick={handleAddressSearch}
                      >
                        <span className="font-normal text-[13px] text-black">주소 검색</span>
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
                <div className="flex flex-col items-start w-full">
                  <div className="flex font-bold gap-[50px] items-center py-[10px] text-[18px] w-full relative">
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
                    {/* 하단 인디케이터 바 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white h-[3px]">
                      <div
                        className={`absolute bg-[#7bb5ff] h-[3px] top-0 transition-all duration-300 ${
                          activeTab === '사건'
                            ? 'left-[0px] w-[36px]'  // "사건" 위치 (공백 없음)
                            : 'left-[86px] w-[54px]'  // "변호사" 위치 (36px + 50px)
                        }`}
                      />
                    </div>
                  </div>
                  {/* 변호사 탭 설명 */}
                  {activeTab === '변호사' && (
                    <div className="mt-[15px]">
                      <p className="text-[14px] text-[#666]">즐겨찾기한 변호사</p>
                    </div>
                  )}
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
                                // 해당 세션의 대화 내역으로 이동
                                navigate('/search-results', {
                                  state: {
                                    sessionUuid: session.session_uuid,
                                  }
                                });
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