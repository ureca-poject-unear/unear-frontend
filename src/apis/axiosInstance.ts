import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://dev.unear.site/api/app',
  headers: {
    'Content-Type': 'application/json',
  },
});

//토근 전역 상태관리 전까지 테스트용도
axiosInstance.interceptors.request.use((config) => {
  const token = 'token값';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
