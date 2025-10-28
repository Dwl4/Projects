import api from './config';
import axios from 'axios';

// 판례 검색 관련 API 서비스

const LAW_SEARCH_URL = 'http://www.law.go.kr/DRF/lawSearch.do';
const LAW_DETAIL_URL = 'http://www.law.go.kr/DRF/lawService.do';
const LAW_API_OC = process.env.REACT_APP_LAW_API_OC || '';

/**
 * 국가법령정보센터 판례 목록 검색 (실제 검색 API)
 * @param {Object} searchParams - { caseNumber, caseName, reference, keyword, page, display }
 * @returns {Promise<Object>} 판례 검색 결과
 */
export const searchCaseLawsFromGov = async (searchParams = {}) => {
  try {
    const params = {
      OC: LAW_API_OC,
      target: 'prec',
      type: 'JSON'
    };

    // 사건번호 검색
    if (searchParams.caseNumber) {
      params.nb = searchParams.caseNumber;
    }

    // 사건명 또는 키워드 검색
    if (searchParams.caseName) {
      params.query = searchParams.caseName;
    } else if (searchParams.keyword) {
      params.query = searchParams.keyword;
    }

    // 참조법령 검색
    if (searchParams.reference) {
      params.JO = searchParams.reference;
    }

    // 법원명 검색
    if (searchParams.courtName) {
      params.curt = searchParams.courtName;
    }

    // 페이지 번호 (기본값: 1)
    params.page = searchParams.page || 1;

    // 페이지당 표시 개수 (기본값: 10, 최대: 100)
    params.display = searchParams.display || 10;

    console.log('판례 검색 API 요청:', params);

    const response = await axios.get(LAW_SEARCH_URL, {
      params,
      timeout: 30000
    });

    console.log('판례 검색 API 응답:', response.data);

    return response.data;
  } catch (error) {
    console.error('국가법령정보 판례 검색 오류:', error);
    throw error;
  }
};

/**
 * 국가법령정보센터 판례 본문 조회 (상세 정보)
 * @param {string} id - 판례 일련번호
 * @returns {Promise<Object>} 판례 상세 정보
 */
export const getCaseLawFromGov = async (id) => {
  try {
    const params = {
      OC: LAW_API_OC,
      target: 'prec',
      type: 'JSON',
      ID: id
    };

    console.log('판례 상세 API 요청:', params);
    console.log('판례 상세 API URL:', LAW_DETAIL_URL);

    const response = await axios.get(LAW_DETAIL_URL, {
      params,
      timeout: 30000
    });

    console.log('판례 상세 API 전체 응답:', response);
    console.log('판례 상세 API 응답 데이터:', response.data);
    console.log('판례 상세 API 응답 타입:', typeof response.data);

    return response.data;
  } catch (error) {
    console.error('국가법령정보 상세 API 오류:', error);
    throw error;
  }
};

/**
 * 판례 검색 (기존 백엔드 API)
 * @param {Object} params - { keyword, category, court, case_type, page, limit }
 */
export const searchCaseLaws = async (params) => {
  const response = await api.get('/case-laws/search', { params });
  return response.data;
};

/**
 * 판례 상세 조회 (기존 백엔드 API)
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
