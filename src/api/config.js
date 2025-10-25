import axios from 'axios';

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 모든 요청에 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리 및 토큰 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러 (토큰 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          // TODO: Refresh Token API 구현 후 활성화
          // const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          //   refresh_token: refreshToken
          // });
          // localStorage.setItem('access_token', response.data.access_token);
          // originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          // return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh Token도 만료된 경우 로그아웃
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_type');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 403 에러 (권한 없음)
    if (error.response?.status === 403) {
      console.error('권한이 없습니다.');
    }

    // 404 에러
    if (error.response?.status === 404) {
      console.error('요청한 리소스를 찾을 수 없습니다.');
    }

    // 500 에러
    if (error.response?.status === 500) {
      console.error('서버 오류가 발생했습니다.');
    }

    return Promise.reject(error);
  }
);

export default api;
