import api from './config';

// 변호사 관련 API 서비스

/**
 * 변호사 검색
 * @param {Object} params - { keyword, specialty, region, min_rating, max_fee, page, limit }
 */
export const searchLawyers = async (params) => {
  const response = await api.get('/lawyers/search', { params });
  return response.data;
};

/**
 * 변호사 상세 조회
 * @param {number} lawyerId
 */
export const getLawyerDetail = async (lawyerId) => {
  const response = await api.get(`/lawyers/${lawyerId}`);
  return response.data;
};

/**
 * 현재 로그인한 변호사 정보 조회 (인증 필요, 변호사만 가능)
 */
export const getCurrentLawyer = async () => {
  const response = await api.get('/lawyers/me');
  return response.data;
};

/**
 * 내 변호사 프로필 수정 (인증 필요, 변호사만 가능)
 * @param {FormData} formData - name, phone, law_firm, address, introduction, specialties, education, career, consultation_fee, region, profile_image
 */
export const updateMyProfile = async (formData) => {
  const response = await api.put('/lawyers/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 내 즐겨찾기 변호사 목록 (인증 필요)
 */
export const getMyFavoriteLawyers = async () => {
  const response = await api.get('/lawyers/favorites/my');
  return response.data;
};

/**
 * 변호사 즐겨찾기 추가 (인증 필요)
 * @param {number} lawyerUserId
 */
export const addLawyerToFavorites = async (lawyerUserId) => {
  const response = await api.post(`/lawyers/favorites/${lawyerUserId}`);
  return response.data;
};

/**
 * 변호사 즐겨찾기 삭제 (인증 필요)
 * @param {number} lawyerUserId
 */
export const removeLawyerFromFavorites = async (lawyerUserId) => {
  const response = await api.delete(`/lawyers/favorites/${lawyerUserId}`);
  return response.data;
};
