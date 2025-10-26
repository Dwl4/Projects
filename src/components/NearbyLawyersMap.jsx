import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { lawyerService, authService } from '../api';

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

  // 한국 주요 도시/구/동 중심 좌표 (폴백용)
  const koreanCityCoords = {
    // 서울 강남구 동별
    '서울 강남구 신사동': [37.5172, 127.0205],
    '서울 강남구 논현동': [37.5104, 127.0226],
    '서울 강남구 압구정동': [37.5275, 127.0283],
    '서울 강남구 청담동': [37.5244, 127.0473],
    '서울 강남구 삼성동': [37.5140, 127.0631],
    '서울 강남구 대치동': [37.4944, 127.0618],
    '서울 강남구 역삼동': [37.5007, 127.0366],
    '서울 강남구 도곡동': [37.4878, 127.0454],
    '서울 강남구 개포동': [37.4836, 127.0617],
    '서울 강남구 일원동': [37.4840, 127.0829],
    '서울 강남구 수서동': [37.4869, 127.1026],

    // 서울 서초구 동별
    '서울 서초구 서초동': [37.4836, 127.0144],
    '서울 서초구 잠원동': [37.5145, 127.0119],
    '서울 서초구 반포동': [37.5040, 127.0024],
    '서울 서초구 방배동': [37.4812, 126.9966],
    '서울 서초구 양재동': [37.4703, 127.0351],
    '서울 서초구 내곡동': [37.4621, 127.0776],

    // 서울 종로구 동별
    '서울 종로구 청운동': [37.5808, 126.9679],
    '서울 종로구 사직동': [37.5759, 126.9675],
    '서울 종로구 삼청동': [37.5845, 126.9824],
    '서울 종로구 혜화동': [37.5886, 127.0019],
    '서울 종로구 이화동': [37.5803, 127.0050],
    '서울 종로구 창신동': [37.5762, 127.0157],

    // 서울 중구 동별
    '서울 중구 명동': [37.5636, 126.9861],
    '서울 중구 남대문로': [37.5593, 126.9784],
    '서울 중구 소공동': [37.5647, 126.9775],
    '서울 중구 을지로': [37.5662, 126.9911],
    '서울 중구 신당동': [37.5639, 127.0175],
    '서울 중구 황학동': [37.5702, 127.0217],

    // 서울 용산구 동별
    '서울 용산구 이촌동': [37.5244, 126.9668],
    '서울 용산구 한남동': [37.5344, 127.0023],
    '서울 용산구 이태원동': [37.5344, 126.9944],
    '서울 용산구 삼각지': [37.5347, 126.9729],
    '서울 용산구 용산동': [37.5323, 126.9881],

    // 서울 마포구 동별
    '서울 마포구 아현동': [37.5566, 126.9562],
    '서울 마포구 공덕동': [37.5450, 126.9514],
    '서울 마포구 도화동': [37.5490, 126.9476],
    '서울 마포구 용강동': [37.5427, 126.9424],
    '서울 마포구 대흥동': [37.5545, 126.9601],
    '서울 마포구 염리동': [37.5478, 126.9566],
    '서울 마포구 신수동': [37.5511, 126.9643],
    '서울 마포구 서강동': [37.5494, 126.9363],
    '서울 마포구 서교동': [37.5547, 126.9218],
    '서울 마포구 합정동': [37.5495, 126.9139],
    '서울 마포구 망원동': [37.5556, 126.9047],
    '서울 마포구 연남동': [37.5628, 126.9261],
    '서울 마포구 성산동': [37.5665, 126.9136],
    '서울 마포구 상수동': [37.5476, 126.9227],

    // 서울 영등포구 동별
    '서울 영등포구 여의도동': [37.5219, 126.9245],
    '서울 영등포구 영등포동': [37.5264, 126.8963],
    '서울 영등포구 당산동': [37.5343, 126.8967],
    '서울 영등포구 문래동': [37.5174, 126.8947],
    '서울 영등포구 양평동': [37.5324, 126.8905],

    // 서울 송파구 동별
    '서울 송파구 잠실동': [37.5133, 127.0821],
    '서울 송파구 신천동': [37.5145, 127.1059],
    '서울 송파구 풍납동': [37.5300, 127.1155],
    '서울 송파구 송파동': [37.5050, 127.1107],
    '서울 송파구 석촌동': [37.5044, 127.1007],
    '서울 송파구 삼전동': [37.4995, 127.0920],
    '서울 송파구 가락동': [37.4927, 127.1189],
    '서울 송파구 문정동': [37.4858, 127.1219],
    '서울 송파구 장지동': [37.4762, 127.1261],
    '서울 송파구 오금동': [37.5011, 127.1283],

    // 대전 동구 동별
    '대전 동구 판교동': [36.3571, 127.4697],
    '대전 동구 용운동': [36.3382, 127.4538],
    '대전 동구 가양동': [36.3329, 127.4405],
    '대전 동구 용전동': [36.3517, 127.4473],
    '대전 동구 홍도동': [36.3430, 127.4542],

    // 부산 해운대구 동별
    '부산 해운대구 우동': [35.1631, 129.1635],
    '부산 해운대구 중동': [35.1586, 129.1598],
    '부산 해운대구 좌동': [35.1523, 129.1722],
    '부산 해운대구 송정동': [35.1786, 129.1998],
    '부산 해운대구 반여동': [35.1820, 129.1289],

    // 서울 구별 (폴백)
    '서울 종로구': [37.5735, 126.9788],
    '서울 중구': [37.5641, 126.9979],
    '서울 용산구': [37.5326, 126.9905],
    '서울 성동구': [37.5633, 127.0369],
    '서울 광진구': [37.5385, 127.0823],
    '서울 동대문구': [37.5744, 127.0399],
    '서울 중랑구': [37.6065, 127.0927],
    '서울 성북구': [37.5894, 127.0167],
    '서울 강북구': [37.6398, 127.0255],
    '서울 도봉구': [37.6688, 127.0471],
    '서울 노원구': [37.6542, 127.0568],
    '서울 은평구': [37.6176, 126.9227],
    '서울 서대문구': [37.5791, 126.9368],
    '서울 마포구': [37.5663, 126.9019],
    '서울 양천구': [37.5170, 126.8666],
    '서울 강서구': [37.5509, 126.8495],
    '서울 구로구': [37.4954, 126.8874],
    '서울 금천구': [37.4568, 126.8956],
    '서울 영등포구': [37.5264, 126.8963],
    '서울 동작구': [37.5124, 126.9393],
    '서울 관악구': [37.4784, 126.9516],
    '서울 서초구': [37.4837, 127.0324],
    '서울 강남구': [37.5172, 127.0473],
    '서울 송파구': [37.5145, 127.1059],
    '서울 강동구': [37.5301, 127.1238],

    // 광역시
    '부산 중구': [35.1067, 129.0322],
    '부산 서구': [35.0972, 129.0246],
    '부산 동구': [35.1295, 129.0456],
    '부산 영도구': [35.0912, 129.0678],
    '부산 부산진구': [35.1629, 129.0532],
    '부산 동래구': [35.2048, 129.0839],
    '부산 남구': [35.1364, 129.0843],
    '부산 북구': [35.1976, 128.9895],
    '부산 해운대구': [35.1631, 129.1635],
    '부산 사하구': [35.1043, 128.9749],
    '부산 금정구': [35.2429, 129.0927],
    '부산 강서구': [35.2120, 128.9804],
    '부산 연제구': [35.1761, 129.0816],
    '부산 수영구': [35.1454, 129.1134],
    '부산 사상구': [35.1521, 128.9910],
    '부산 기장군': [35.2446, 129.2224],

    '대구 중구': [35.8694, 128.6067],
    '대구 동구': [35.8869, 128.6350],
    '대구 서구': [35.8718, 128.5593],
    '대구 남구': [35.8463, 128.5974],
    '대구 북구': [35.8858, 128.5829],
    '대구 수성구': [35.8581, 128.6311],
    '대구 달서구': [35.8298, 128.5326],
    '대구 달성군': [35.7749, 128.4313],

    '인천 중구': [37.4738, 126.6216],
    '인천 동구': [37.4739, 126.6432],
    '인천 미추홀구': [37.4635, 126.6504],
    '인천 연수구': [37.4106, 126.6784],
    '인천 남동구': [37.4474, 126.7314],
    '인천 부평구': [37.5069, 126.7218],
    '인천 계양구': [37.5376, 126.7378],
    '인천 서구': [37.5454, 126.6765],
    '인천 강화군': [37.7469, 126.4882],
    '인천 옹진군': [37.4464, 126.6366],

    '광주 동구': [35.1460, 126.9230],
    '광주 서구': [35.1522, 126.8895],
    '광주 남구': [35.1327, 126.9026],
    '광주 북구': [35.1740, 126.9117],
    '광주 광산구': [35.1396, 126.7935],

    '대전 동구': [36.3505, 127.4547],
    '대전 중구': [36.3255, 127.4211],
    '대전 서구': [36.3554, 127.3838],
    '대전 유성구': [36.3622, 127.3567],
    '대전 대덕구': [36.3466, 127.4167],

    '울산 중구': [35.5684, 129.3328],
    '울산 남구': [35.5438, 129.3300],
    '울산 동구': [35.5049, 129.4163],
    '울산 북구': [35.5819, 129.3614],
    '울산 울주군': [35.5226, 129.1542],

    '세종': [36.4801, 127.2890],

    // 시 단위 (기본)
    '서울': [37.5665, 126.9780],
    '부산': [35.1796, 129.0756],
    '대구': [35.8714, 128.6014],
    '인천': [37.4563, 126.7052],
    '광주': [35.1595, 126.8526],
    '대전': [36.3504, 127.3845],
    '울산': [35.5384, 129.3114],
  };

  // 주소 정규화 (특별시, 광역시 제거)
  const normalizeAddress = (address) => {
    if (!address) return '';
    return address
      .replace(/특별시/g, '')
      .replace(/광역시/g, '')
      .replace(/특별자치시/g, '')
      .replace(/\s+/g, ' ') // 연속된 공백을 하나로
      .trim();
  };

  // 주소에서 시/구/동 추출하여 폴백 좌표 찾기 (동 > 구 > 시 순서로 우선순위)
  const getFallbackCoords = (address) => {
    if (!address) return null;

    // 주소 정규화
    const normalized = normalizeAddress(address);

    // 모든 매칭 후보를 찾고 가장 긴 매칭(가장 구체적인 매칭)을 선택
    let bestMatch = null;
    let bestMatchLength = 0;
    let bestMatchKey = '';

    for (const [key, coords] of Object.entries(koreanCityCoords)) {
      if (normalized.includes(key)) {
        // 더 긴 매칭을 우선 (예: "서울 강남구 신사동" > "서울 강남구" > "서울")
        if (key.length > bestMatchLength) {
          bestMatch = coords;
          bestMatchLength = key.length;
          bestMatchKey = key;
        }
      }
    }

    if (bestMatch) {
      const precision = bestMatchKey.split(' ').length === 3 ? '동 단위' :
                       bestMatchKey.split(' ').length === 2 ? '구 단위' : '시 단위';
      console.log(`📍 폴백 좌표 사용 (${precision}): ${address} → ${bestMatchKey}`);
      return bestMatch;
    }

    // 위에서 매칭 실패 시 시 단위 매칭 시도
    if (normalized.includes('서울')) return koreanCityCoords['서울'];
    if (normalized.includes('부산')) return koreanCityCoords['부산'];
    if (normalized.includes('대구')) return koreanCityCoords['대구'];
    if (normalized.includes('인천')) return koreanCityCoords['인천'];
    if (normalized.includes('광주')) return koreanCityCoords['광주'];
    if (normalized.includes('대전')) return koreanCityCoords['대전'];
    if (normalized.includes('울산')) return koreanCityCoords['울산'];
    if (normalized.includes('세종')) return koreanCityCoords['세종'];

    return null;
  };

  // 지오코딩 (폴백 좌표 사용)
  const geocodeAddress = async (address) => {
    if (!address) return null;

    const coords = getFallbackCoords(address);
    if (coords) {
      return coords;
    } else {
      console.warn(`❌ 좌표 변환 실패: ${address}`);
      return null;
    }
  };

  // 초기화: 사용자 주소 및 변호사 목록 가져오기
  useEffect(() => {
    const initializeMap = async () => {
      try {
        setLoading(true);

        // 사용자 정보 API 호출
        let address = '서울 강남구'; // 기본값
        try {
          const userInfo = await authService.getCurrentUser();
          console.log('✅ 사용자 정보:', userInfo);
          if (userInfo.address) {
            address = userInfo.address;
          }
        } catch (err) {
          console.warn('⚠️ 사용자 정보 조회 실패 (비로그인 또는 에러), 기본 주소 사용:', err.message);
        }

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
        <p className="text-[12px] text-amber-600 mt-[5px] font-medium">
          ⚠️ 지도에 표시된 위치는 동/구 단위의 대략적인 위치입니다
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
              <Marker key={lawyer.id} position={lawyer.coords} icon={lawyerIcon}>
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
                      onClick={() => navigate(`/lawyer-profile/${lawyer.id}`)}
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
