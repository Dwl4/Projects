import api from './config';

// 공지사항 관련 API 서비스

/**
 * 공지사항 목록 조회
 * @param {Object} params - { page, limit }
 */
export const getNotices = async (params) => {
  const response = await api.get('/notices', { params });
  return response.data;
};

/**
 * 카테고리 목록 조회
 */
export const getCategories = async () => {
  const response = await api.get('/notices/categories');
  return response.data;
};

/**
 * 공지사항 상세 조회
 * @param {number} noticeId
 */
export const getNoticeDetail = async (noticeId) => {
  const response = await api.get(`/notices/${noticeId}`);
  return response.data;
};

// 아래 API들은 관리자 권한 구현 후 사용 가능 (현재 501 Not Implemented)

/**
 * 공지사항 생성 (관리자 전용)
 * @param {Object} noticeData - { title, content, is_pinned }
 */
export const createNotice = async (noticeData) => {
  const response = await api.post('/notices', noticeData);
  return response.data;
};

/**
 * 공지사항 수정 (관리자 전용)
 * @param {number} noticeId
 * @param {Object} noticeData - { title, content, is_pinned }
 */
export const updateNotice = async (noticeId, noticeData) => {
  const response = await api.put(`/notices/${noticeId}`, noticeData);
  return response.data;
};

/**
 * 공지사항 삭제 (관리자 전용)
 * @param {number} noticeId
 */
export const deleteNotice = async (noticeId) => {
  const response = await api.delete(`/notices/${noticeId}`);
  return response.data;
};
