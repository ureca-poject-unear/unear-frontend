import axios from 'axios';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios 에러 타입 정의
interface AxiosError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  code?: string;
  message?: string;
}

// 로그인 요청 인터페이스
interface LoginCredentials {
  username: string;
  password: string;
}

// 로그인 응답 인터페이스
interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
  message: string;
}

/**
 * 사용자 로그인
 * @param credentials 로그인 자격 증명
 * @returns 로그인 응답 데이터
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('🔑 로그인 요청 시작...');

    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
      timeout: 10000, // 10초 타임아웃
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success) {
      console.log('✅ 로그인 성공');
      showSuccessToast('로그인되었습니다.');
    }

    return response.data;
  } catch (error: unknown) {
    console.error('❌ 로그인 실패:', error);

    const axiosError = error as AxiosError;

    // 세분화된 에러 처리
    if (axiosError.response) {
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message;

      switch (status) {
        case 400:
          showErrorToast(message || '잘못된 요청입니다.');
          throw new Error(message || 'Invalid credentials');
        case 401:
          showErrorToast('이메일 또는 비밀번호가 일치하지 않습니다.');
          throw new Error('Invalid email or password');
        case 403:
          showErrorToast('계정이 비활성화되었습니다. 관리자에게 문의하세요.');
          throw new Error('Account is disabled');
        case 429:
          showErrorToast('너무 많은 로그인 시도입니다. 잠시 후 다시 시도해주세요.');
          throw new Error('Too many login attempts');
        case 500:
          showErrorToast('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          throw new Error('Internal server error');
        default:
          if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
            showErrorToast('네트워크 연결을 확인해주세요.');
            throw new Error('Network connection failed');
          } else {
            showErrorToast(message || '로그인에 실패했습니다.');
            throw new Error(message || 'Login failed');
          }
      }
    }

    // 예상치 못한 오류
    showErrorToast('예상치 못한 오류가 발생했습니다.');
    throw new Error('An unexpected error occurred');
  }
};

/**
 * 로그아웃 (서버에 로그아웃 요청)
 * @param refreshToken 리프레시 토큰
 */
export const logout = async (refreshToken?: string): Promise<void> => {
  try {
    if (refreshToken) {
      console.log('🚪 서버 로그아웃 요청...');

      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {
          refreshToken,
        },
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ 서버 로그아웃 완료');
    }
  } catch (error: unknown) {
    // 로그아웃 요청 실패는 치명적이지 않음 (클라이언트 로그아웃은 계속 진행)
    console.warn('⚠️ 서버 로그아웃 요청 실패 (클라이언트 로그아웃은 계속 진행):', error);
  }
};
