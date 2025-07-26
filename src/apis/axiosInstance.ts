import axios from 'axios';
import qs from 'qs';

const axiosInstance = axios.create({
  baseURL: 'https://dev.unear.site/api/app',
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
});

// 토큰 전역 상태관리 전까지 테스트용도
axiosInstance.interceptors.request.use((config) => {
  const token = 'Token값';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
