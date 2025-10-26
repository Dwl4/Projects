import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { lawyerService } from '../api';

// Leaflet 기본 아이콘 설정 (빌드 문제 해결)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 사용자 위치 마커 (파란색)
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 변호사 위치 마커 (빨간색)
const lawyerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const NearbyLawyersMap = () => {
  const navigate = useNavigate();
  const [userAddress, setUserAddress] = useState('');
  const [userCoords, setUserCoords] = useState([37.5665, 126.9780]); // 기본: 서울시청
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 한국 주소 정규화 (짧은 주소를 전체 주소로 변환)
  const normalizeKoreanAddress = (address) => {
    if (!address) return address;

    // 이미 전체 주소면 그대로 반환
    if (address.includes('광역시') || address.includes('특별시') || address.includes('도')) {
      return address;
    }

    // 짧은 주소 형식 처리
    const cityMap = {
      '서울': '서울특별시',
      '부산': '부산광역시',
      '대구': '대구광역시',
      '인천': '인천광역시',
      '광주': '광주광역시',
      '대전': '대전광역시',
      '울산': '울산광역시',
      '세종': '세종특별자치시',
      '경기': '경기도',
      '강원': '강원도',
      '충북': '충청북도',
      '충남': '충청남도',
      '전북': '전라북도',
      '전남': '전라남도',
      '경북': '경상북도',
      '경남': '경상남도',
      '제주': '제주특별자치도'
    };

    // 첫 단어 확인
    const firstWord = address.split(' ')[0];
    if (cityMap[firstWord]) {
      return address.replace(firstWord, cityMap[firstWord]);
    }

    return address;
  };

  // Nominatim 지오코딩 (OpenStreetMap)
  const geocodeAddress = async (address) => {
    try {
      // 한국 주소 정규화
      const normalizedAddress = normalizeKoreanAddress(address);
      const query = `${normalizedAddress}, 대한민국`;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=kr`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (err) {
      console.error('지오코딩 실패:', err);
      return null;
    }
  };

  // 초기화: 사용자 주소 및 변호사 목록 가져오기
  useEffect(() => {
    const initializeMap = async () => {
      try {
        setLoading(true);

        // 사용자 주소 가져오기
        const address = localStorage.getItem('user_address') || '서울특별시 강남구';
        setUserAddress(address);

        // 사용자 주소를 좌표로 변환
        const coords = await geocodeAddress(address);
        if (coords) {
          setUserCoords(coords);
        }

        // 변호사 목록 가져오기
        console.log('🔵 변호사 목록 조회 중...');
        const response = await lawyerService.searchLawyers({
          limit: 100,
        });

        console.log('✅ 변호사 목록 받음', response);

        if (response.items && response.items.length > 0) {
          // 각 변호사의 주소를 좌표로 변환
          const lawyersWithCoords = await Promise.all(
            response.items.map(async (lawyer) => {
              if (!lawyer.address) {
                console.warn(`변호사 ${lawyer.name}의 주소 정보 없음`);
                return null;
              }

              const coords = await geocodeAddress(lawyer.address);
              if (coords) {
                return {
                  ...lawyer,
                  coords: coords,
                };
              } else {
                console.warn(`변호사 ${lawyer.name}의 주소 변환 실패:`, lawyer.address);
                return null;
              }
            })
          );

          // null 제거
          const validLawyers = lawyersWithCoords.filter(l => l !== null);
          setLawyers(validLawyers);
          console.log(`✅ ${validLawyers.length}명의 변호사 위치 표시`);
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ 초기화 실패:', err);
        setError('지도를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    initializeMap();
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="flex-shrink-0 h-[100px] flex items-center justify-center border-b border-gray-200">
        <h1 className="text-[30px] font-bold text-black">내 근처 변호사 찾기</h1>
      </div>

      {/* 안내 문구 */}
      <div className="flex-shrink-0 px-[60px] py-[15px] bg-gray-50 border-b border-gray-200">
        <p className="text-[14px] text-gray-600">
          📍 현재 위치: <span className="font-medium">{userAddress}</span>
        </p>
        <p className="text-[12px] text-gray-500 mt-[5px]">
          🔴 빨간 마커: 변호사 위치 ({lawyers.length}명) | 🔵 파란 마커: 내 위치
        </p>
        <p className="text-[12px] text-gray-500">
          마커를 클릭하면 상세 정보를 확인할 수 있습니다
        </p>
        {error && (
          <p className="text-[14px] text-red-500 mt-[5px]">{error}</p>
        )}
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-[1000]">
            <p className="text-[16px] text-gray-500">지도를 불러오는 중...</p>
          </div>
        )}

        {!loading && (
          <MapContainer
            center={userCoords}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 사용자 위치 마커 */}
            <Marker position={userCoords} icon={userIcon}>
              <Popup>
                <div style={{ padding: '5px' }}>
                  <strong>내 위치</strong>
                  <br />
                  {userAddress}
                </div>
              </Popup>
            </Marker>

            {/* 변호사 위치 마커들 */}
            {lawyers.map((lawyer) => (
              <Marker key={lawyer.user_id} position={lawyer.coords} icon={lawyerIcon}>
                <Popup>
                  <div style={{ padding: '10px', minWidth: '150px' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold' }}>
                      {lawyer.name}
                    </h3>
                    {lawyer.law_firm && (
                      <p style={{ margin: '0 0 3px 0', fontSize: '12px', color: '#666' }}>
                        {lawyer.law_firm}
                      </p>
                    )}
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
                      {lawyer.address}
                    </p>
                    <button
                      onClick={() => navigate(`/lawyer-profile/${lawyer.user_id}`)}
                      style={{
                        padding: '5px 12px',
                        background: '#9EC3E5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      프로필 보기
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="flex-shrink-0 px-[60px] py-[20px] border-t border-gray-200">
        <div className="flex gap-[10px] justify-center">
          <button
            onClick={() => navigate('/lawyer-list')}
            className="px-[30px] py-[12px] bg-[#9EC3E5] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#7da9d3] transition-colors"
          >
            전체 변호사 목록 보기
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-[30px] py-[12px] bg-gray-400 text-white text-[14px] font-medium rounded-[8px] hover:bg-gray-500 transition-colors"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyLawyersMap;
