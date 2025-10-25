import api from './config';

// 법률 용어 사전 관련 API 서비스

/**
 * 법률 용어 검색
 * @param {Object} params - { keyword, consonant, category, page, limit }
 */
export const searchTerms = async (params) => {
  const response = await api.get('/dictionary/search', { params });
  return response.data;
};

/**
 * 카테고리 목록 조회
 */
export const getCategories = async () => {
  const response = await api.get('/dictionary/categories');
  return response.data;
};

/**
 * 인기 법률 용어
 * @param {number} limit
 */
export const getPopularTerms = async (limit = 10) => {
  const response = await api.get('/dictionary/popular', {
    params: { limit },
  });
  return response.data;
};

/**
 * 최근 추가된 법률 용어
 * @param {number} limit
 */
export const getRecentTerms = async (limit = 10) => {
  const response = await api.get('/dictionary/recent', {
    params: { limit },
  });
  return response.data;
};

/**
 * 법률 용어 상세 조회
 * @param {number} termId
 */
export const getTermDetail = async (termId) => {
  const response = await api.get(`/dictionary/${termId}`);
  return response.data;
};

/**
 * 내 즐겨찾기 용어 목록 (인증 필요)
 */
export const getMyFavoriteTerms = async () => {
  const response = await api.get('/dictionary/favorites/my');
  return response.data;
};

/**
 * 용어 즐겨찾기 추가 (인증 필요)
 * @param {number} termId
 */
export const addTermToFavorites = async (termId) => {
  const response = await api.post(`/dictionary/${termId}/favorite`);
  return response.data;
};

/**
 * 용어 즐겨찾기 삭제 (인증 필요)
 * @param {number} termId
 */
export const removeTermFromFavorites = async (termId) => {
  const response = await api.delete(`/dictionary/${termId}/favorite`);
  return response.data;
};
