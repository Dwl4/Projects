import api from './config';

// 판례 검색 관련 API 서비스

/**
 * 판례 검색
 * @param {Object} params - { keyword, category, court, case_type, page, limit }
 */
export const searchCaseLaws = async (params) => {
  const response = await api.get('/case-laws/search', { params });
  return response.data;
};

/**
 * 판례 상세 조회
 * @param {number} caseLawId
 */
export const getCaseLawDetail = async (caseLawId) => {
  const response = await api.get(`/case-laws/${caseLawId}`);
  return response.data;
};

/**
 * 내 즐겨찾기 판례 목록 (인증 필요)
 */
export const getMyFavoriteCaseLaws = async () => {
  const response = await api.get('/case-laws/favorites/my');
  return response.data;
};

/**
 * 판례 즐겨찾기 추가 (인증 필요)
 * @param {number} caseLawId
 */
export const addCaseLawToFavorites = async (caseLawId) => {
  const response = await api.post(`/case-laws/${caseLawId}/favorite`);
  return response.data;
};

/**
 * 판례 즐겨찾기 삭제 (인증 필요)
 * @param {number} caseLawId
 */
export const removeCaseLawFromFavorites = async (caseLawId) => {
  const response = await api.delete(`/case-laws/${caseLawId}/favorite`);
  return response.data;
};
