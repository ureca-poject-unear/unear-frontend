import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { showErrorToast } from '@/utils/toast';

// 환경변수에서 API URL 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 커스텀 config 타입 정의
interface CustomConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// API 응답 타입 정의
interface RefreshTokenResponse {
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

// 타입 가드 함수
const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // HttpOnly 쿠키 자동 전송 활성화
});

// 토큰 갱신 중복 요청 방지를 위한 Promise 캐시
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

// 대기열 처리 함수
const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

// Refresh Token으로 Access Token 갱신하는 함수 (HttpOnly 쿠키 지원)
const refreshAccessToken = async (): Promise<string | null> => {
  const { setAccessToken, setRefreshToken, setStoredTokens, logout } = useAuthStore.getState();

  try {
    console.log('🔄 Refresh Token으로 Access Token 갱신 시도...');

    // HttpOnly 쿠키에 있는 Refresh Token은 자동으로 전송됨
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {
        // body에 refreshToken을 포함하지 않음 (HttpOnly 쿠키에서 자동 전송)
      },
      {
        withCredentials: true, // 쿠키 자동 전송
      }
    );

    const responseData = response.data as RefreshTokenResponse;

    if (response.status === 200 && responseData.data?.accessToken) {
      const newAccessToken = responseData.data.accessToken;
      const newRefreshToken = responseData.data.refreshToken || 'httponly-cookie';

      // 새 토큰들 저장
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setStoredTokens(newAccessToken, newRefreshToken);

      console.log('✅ Access Token 갱신 성공');
      return newAccessToken;
    } else {
      throw new Error('Invalid refresh response');
    }
  } catch (error: unknown) {
    console.error('❌ Refresh Token 갱신 실패:', error);

    const axiosError = error as AxiosError;

    // 세분화된 에러 처리
    if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
      console.log('🚪 Refresh Token 만료 - 로그아웃 처리');
      showErrorToast('세션이 만료되었습니다. 다시 로그인해주세요.');
      logout();

      // 로그인 페이지로 리다이렉트
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
      console.warn('⚠️ 네트워크 오류 - Refresh Token 갱신 실패');
      showErrorToast('네트워크 연결을 확인해주세요.');
    } else {
      console.error('❌ 알 수 없는 오류:', error);
      showErrorToast('인증 오류가 발생했습니다.');
    }

    return null;
  }
};

// 요청 인터셉터 - 토큰 자동 첨부
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().getStoredAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 에러 시 자동 토큰 갱신
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: unknown) => {
    // Axios 에러인지 확인
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as CustomConfig;

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 이미 토큰 갱신 중인 경우 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      console.log('🔄 401 error detected, attempting token refresh...');

      try {
        // Refresh Token으로 새 Access Token 받기
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          // 대기 중인 요청들 처리
          processQueue(null, newAccessToken);

          // 새 토큰으로 원래 요청 재시도
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return axiosInstance(originalRequest);
        } else {
          // Refresh 실패 시 대기열 에러 처리
          processQueue(new Error('Token refresh failed'), null);

          // 로그인 페이지로 이동 (네트워크 오류가 아닌 경우만)
          if (window.location.pathname !== '/login' && error.response) {
            window.location.href = '/login';
          }

          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh 실패 시 대기열 에러 처리
        processQueue(
          refreshError instanceof Error ? refreshError : new Error('Token refresh failed'),
          null
        );
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
