import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lawyerService } from '../api';

const LawyerListContent = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalLawyers, setTotalLawyers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const navigate = useNavigate();

  // localStorage에서 즐겨찾기 불러오기
  const getFavoritesFromStorage = () => {
    const stored = localStorage.getItem('lawyerFavorites');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  };

  const [favorites, setFavorites] = useState(getFavoritesFromStorage());

  // 변호사 목록 불러오기
  useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔍 변호사 검색 요청:', {
          keyword: searchKeyword || null,
          page: currentPage,
          limit: limit
        });

        const response = await lawyerService.searchLawyers({
          keyword: searchKeyword || undefined,
          page: currentPage,
          limit: limit
        });

        console.log('✅ 변호사 검색 응답:', response);

        // API 응답 구조: { total, page, limit, items }
        setLawyers(response.items || []);
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
  }, [searchKeyword, currentPage, limit]);

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
            본 플랫폼은 변호사 소개 또는 알선을 목적으로 하지 않으며, 변호사 노출 순서는 랜덤 방식으로 운영됩니다.
          </p>
        </div>

        {/* 검색 영역 */}
        <div className="w-full flex items-center justify-center gap-[30px] px-0 py-[10px]">
          <div className="flex items-center justify-center gap-[10px] w-[73px]">
            <p className="text-[15px] text-black whitespace-nowrap">키워드 검색</p>
          </div>
          <div className="bg-[#d9d9d9] rounded-[10px] w-[477px] h-[45px] flex items-center justify-between px-[10px] py-[5px]">
            <input
              type="text"
              placeholder="전문 분야, 변호사 성함 등을 입력해주세요."
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
          <div className="w-full flex flex-wrap gap-[35px] justify-between px-[40px] pb-[20px]">
            {lawyers.length === 0 ? (
              <div className="w-full text-center py-[40px]">
                <p className="text-[15px] text-black">검색 결과가 없습니다.</p>
              </div>
            ) : (
              lawyers.map((lawyer) => {
                // 프로필 이미지 URL 처리
                const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://54.180.238.189:8001/api/v1';
                const baseUrl = API_BASE.replace('/api/v1', '');
                const profileImageUrl = lawyer.profile_image
                  ? (lawyer.profile_image.startsWith('http')
                      ? lawyer.profile_image
                      : `${baseUrl}${lawyer.profile_image}`)
                  : '/assets/lawyer-profile.png';

                // 전문분야 개수 계산
                const displayedSpecialties = lawyer.specialties?.slice(0, 3) || [];
                const remainingSpecialtiesCount = (lawyer.specialties?.length || 0) - displayedSpecialties.length;

                return (
            <div
              key={lawyer.id}
              className="bg-[#d9d9d9] rounded-[10px] w-[250px] h-[500px] p-[10px] flex flex-col gap-[10px]"
            >
              {/* 이미지와 소개 */}
              <div className="flex gap-[10px] items-center w-full">
                {/* 짧은 소개 */}
                <div className="w-[120px] h-[160px] overflow-hidden">
                  <p className="text-[11px] text-black leading-normal">
                    {lawyer.law_firm || '법률사무소'}
                  </p>
                  {lawyer.consultation_fee && (
                    <p className="text-[10px] text-black mt-[5px]">
                      💰 {lawyer.consultation_fee.toLocaleString()}원
                    </p>
                  )}
                </div>

                {/* 이미지 */}
                <div className="w-[120px] h-[160px] overflow-hidden rounded-[5px]">
                  <img
                    src={profileImageUrl}
                    alt={lawyer.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/lawyer-profile.png';
                    }}
                  />
                </div>
              </div>

              {/* 변호사 이름 */}
              <div className="flex items-center justify-end gap-[10px] px-[20px]">
                <span className="text-[11px] text-black">변호사</span>
                <span className="text-[15px] font-bold text-black">{lawyer.name}</span>
                {lawyer.is_verified && (
                  <span className="text-[10px] text-blue-600">✓</span>
                )}
              </div>

              {/* 전문 분야 */}
              <div className="flex flex-col gap-[10px] w-full">
                <p className="text-[12px] font-bold text-black">전문 분야</p>
                <div className="grid grid-cols-2 gap-y-[5px] text-[10px] min-h-[41px]">
                  {displayedSpecialties.length > 0 ? (
                    <>
                      {displayedSpecialties.map((spec, idx) => (
                        <div key={idx} className="text-black leading-[0]">
                          <ul className="list-disc ml-[15px]">
                            <li className="leading-normal">{spec}</li>
                          </ul>
                        </div>
                      ))}
                      {remainingSpecialtiesCount > 0 && (
                        <p className="text-[#787878] leading-normal pl-[20px]">
                          외 {remainingSpecialtiesCount}개
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-[#999] text-[10px]">전문분야 미등록</p>
                  )}
                </div>
              </div>

              {/* 주요 경력 - API에는 없으므로 기본 메시지 */}
              <div className="flex flex-col gap-[10px] w-full">
                <p className="text-[12px] font-bold text-black">주요 경력</p>
                <div className="flex flex-col gap-[5px] text-[10px] w-[230px]">
                  <p className="text-[#999] text-[10px] pl-[15px]">프로필에서 확인</p>
                </div>
              </div>

              {/* 활동 지역 */}
              <div className="flex flex-col gap-[10px] w-full">
                <p className="text-[12px] font-bold text-black">활동 지역</p>
                <div className="text-[10px] w-[230px]">
                  <ul className="list-disc ml-[15px]">
                    <li className="text-black leading-normal">{lawyer.region || '미등록'}</li>
                  </ul>
                </div>
              </div>

              {/* 상담하기 */}
              <div className="flex items-center justify-between px-[10px] flex-grow">
                <button
                  onClick={() => toggleFavorite(lawyer.id)}
                  className="size-[25px] bg-center bg-cover bg-no-repeat cursor-pointer hover:opacity-80 transition-all"
                  style={{
                    backgroundImage: `url('/assets/favorite.png')`,
                    filter: favorites.has(lawyer.id)
                      ? 'none'
                      : 'grayscale(100%)'
                  }}
                />
                <button
                  className="text-[10px] font-bold text-black cursor-pointer hover:underline"
                  onClick={() => navigate(`/lawyer-profile/${lawyer.id}`)}
                >
                  프로필 확인하기 →
                </button>
              </div>
            </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default LawyerListContent;
