import api from './config';

// 사용자 관리 관련 API 서비스

/**
 * 사용자 생성
 * @param {Object} userData - { email, name, age, is_active }
 */
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

/**
 * 사용자 목록 조회
 * @param {number} skip
 * @param {number} limit
 */
export const getUsers = async (skip = 0, limit = 100) => {
  const response = await api.get('/users', {
    params: { skip, limit },
  });
  return response.data;
};

/**
 * 사용자 단건 조회
 * @param {number} userId
 */
export const getUserDetail = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

/**
 * 사용자 정보 수정
 * @param {number} userId
 * @param {Object} userData - { name, age, is_active }
 */
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

/**
 * 사용자 삭제
 * @param {number} userId
 */
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

/**
 * 현재 로그인한 사용자 프로필 업데이트
 * @param {FormData} formData - name, nickname, phone, address, profile_image
 */
export const updateCurrentUser = async (formData) => {
  const response = await api.put('/users/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
