import api from './config';

// 인증 관련 API 서비스

/**
 * 일반 사용자 회원가입
 * @param {Object} userData - { email, password, name, nickname, phone, address }
 */
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register/user', userData);
  return response.data;
};

/**
 * 변호사 회원가입
 * @param {FormData} formData - email, password, name, phone, law_firm, address, profile_image
 */
export const registerLawyer = async (formData) => {
  const response = await api.post('/auth/register/lawyer', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 로그인
 * @param {string} email
 * @param {string} password
 * @param {string} userType - "user" 또는 "lawyer"
 */
export const login = async (email, password, userType) => {
  const response = await api.post('/auth/login', {
    email,
    password,
    user_type: userType,
  });

  // 토큰 저장
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user_type', userType);
  }

  return response.data;
};

/**
 * 로그아웃
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_type');
};

/**
 * 로그인 상태 확인
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

/**
 * 사용자 타입 확인
 */
export const getUserType = () => {
  return localStorage.getItem('user_type');
};

/**
 * 현재 로그인한 사용자 정보 조회
 */
export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};
