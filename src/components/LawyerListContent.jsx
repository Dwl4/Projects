import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lawyerService } from '../api';

const LawyerListContent = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalLawyers, setTotalLawyers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const navigate = useNavigate();

  // 전문분야 목록
  const specialties = [
    '전체',
    '이혼',
    '상속',
    '양육권',
    '특허',
    '저작권',
    '상표권',
    '스타트업',
    '투자계약',
    'M&A',
    '민사소송',
    '형사소송',
    '성범죄',
    '부동산',
    '교통사고',
    '의료',
    '노동'
  ];

  // localStorage에서 즐겨찾기 불러오기
  const getFavoritesFromStorage = () => {
    const stored = localStorage.getItem('lawyerFavorites');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  };

  const [favorites, setFavorites] = useState(getFavoritesFromStorage());

  // 배열을 무작위로 섞는 함수 (Fisher-Yates 알고리즘)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // 변호사 목록 불러오기
  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔍 변호사 검색 요청:', {
          keyword: searchKeyword || null,
          specialty: selectedSpecialty && selectedSpecialty !== '전체' ? selectedSpecialty : null,
          page: currentPage,
          limit: limit
        });

        const response = await lawyerService.searchLawyers({
          keyword: searchKeyword || undefined,
          specialty: selectedSpecialty && selectedSpecialty !== '전체' ? selectedSpecialty : undefined,
          page: currentPage,
          limit: limit
        });

        console.log('✅ 변호사 검색 응답:', response);

        // API 응답 구조: { total, page, limit, items }
        // 변호사 목록을 무작위로 섞기
        const shuffledLawyers = shuffleArray(response.items || []);
        setLawyers(shuffledLawyers);
        setTotalLawyers(response.total || 0);
        setCurrentPage(response.page || 1);
      } catch (err) {
        console.error('❌ 변호사 목록 조회 실패:', err);
        setError('변호사 목록을 불러오는데 실패했습니다.');
        setLawyers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, [searchKeyword, selectedSpecialty, currentPage, limit]);

  const toggleFavorite = async (lawyerId) => {
    // 변호사 유저는 즐겨찾기 기능 사용 불가
    const isLawyer = localStorage.getItem('isLawyer') === 'true';
    if (isLawyer) {
      alert('변호사 회원은 즐겨찾기 기능을 이용할 수 없습니다.');
      return;
    }

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

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="w-full flex flex-col items-center px-[30px] py-0 gap-[20px]">
        {/* 안내 문구 */}
        <div className="w-full flex justify-center items-center py-[20px]">
          <p className="text-[15px] text-black text-center leading-[1.5]">
            본 플랫폼은 변호사 소개 또는 알선을 목적으로 하지 않으며, 변호사 노출 순서는 랜덤 방식으로 운영됩니다.<br />
            <span className="text-[13px] text-gray-500">본 변호사들은 가상 인물입니다.</span>
          </p>
        </div>

        {/* 검색 영역 */}
        <div className="w-full flex items-center justify-center gap-[20px] px-0 py-[10px]">
          {/* 전문분야 드롭다운 */}
          <div className="flex items-center gap-[10px]">
            <p className="text-[15px] text-black whitespace-nowrap">전문 분야</p>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-[#d9d9d9] rounded-[10px] h-[45px] px-[15px] text-[15px] text-black outline-none cursor-pointer hover:bg-[#c9c9c9] transition-colors"
            >
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* 키워드 검색 */}
          <div className="flex items-center gap-[10px]">
            <p className="text-[15px] text-black whitespace-nowrap">키워드 검색</p>
            <div className="bg-[#d9d9d9] rounded-[10px] w-[400px] h-[45px] flex items-center justify-between px-[10px] py-[5px]">
              <input
                type="text"
                placeholder="변호사 성함, 법률사무소명 등을 입력해주세요."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[15px] text-black"
              />
              <img
                src="/assets/search-icon.png"
                alt="검색"
                className="w-[35px] h-[35px] rotate-[270deg] cursor-pointer hover:opacity-80"
              />
            </div>
          </div>
        </div>

        {/* 로딩 및 에러 상태 */}
        {loading && (
          <div className="w-full text-center py-[40px]">
            <p className="text-[15px] text-black">변호사 목록을 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="w-full text-center py-[40px]">
            <p className="text-[15px] text-red-600">{error}</p>
          </div>
        )}

        {/* 변호사 카드 그리드 */}
        {!loading && !error && (
          <div className="w-full max-w-[1600px] mx-auto px-[40px] pb-[60px]">
            {lawyers.length === 0 ? (
              <div className="w-full text-center py-[60px]">
                <p className="text-[16px] text-gray-500">검색 결과가 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-[40px]">
              {lawyers.map((lawyer) => {
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
            <div
              key={lawyer.id}
              className="bg-white rounded-[16px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0px_6px_20px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col"
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
                    fill={favorites.has(lawyer.id) ? '#ff6b6b' : 'none'}
                    stroke={favorites.has(lawyer.id) ? '#ff6b6b' : '#666'}
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

                {/* 활동 지역 - region이 있을 때만 표시 */}
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
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default LawyerListContent;
