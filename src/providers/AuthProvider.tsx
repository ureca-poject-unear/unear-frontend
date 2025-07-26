import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import axiosInstance from '@/apis/axiosInstance';
import { getUserInfo } from '@/apis/userInfo';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { showToast } from '@/utils/toast';

interface UserInfo {
  userId: number;
  email: string;
  username: string;
  membershipCode: 'BASIC' | 'VIP' | 'VVIP';
  gender?: 'M' | 'F';
  birthdate?: string;
  tel?: string;
  barcodeNumber?: string;
  provider?: 'GOOGLE' | 'KAKAO' | 'NAVER';
  isProfileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
  userInfo: UserInfo | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    userInfo,
    setAccessToken,
    setRefreshToken,
    setAuthenticated,
    isAuthenticated,
    logout: storeLogout,
    getStoredAccessToken,
    getStoredRefreshToken,
    setStoredTokens,
  } = useAuthStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Refresh Token으로 Access Token 갱신
  const refreshAccessToken = async (): Promise<boolean> => {
    const refreshToken = getStoredRefreshToken();

    if (!refreshToken) {
      console.warn('⚠️ Refresh Token이 없습니다.');
      return false;
    }

    try {
      console.log('🔄 AuthProvider: Access Token 갱신 시도...');

      const response = await axiosInstance.post('/auth/refresh', {
        refreshToken: refreshToken,
      });

      if (response.status === 200 && response.data.data?.accessToken) {
        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken || refreshToken;

        // 새 토큰들 저장
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setStoredTokens(newAccessToken, newRefreshToken);
        setAuthenticated(true);

        console.log('✅ AuthProvider: Access Token 갱신 성공');
        return true;
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (error: unknown) {
      console.error('❌ AuthProvider: Refresh Token 갱신 실패:', error);

      const axiosError = error as {
        response?: { status?: number };
        code?: string;
      };

      // 세분화된 에러 처리
      if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
        console.log('🚪 Refresh Token 만료 - 로그아웃 처리');
        showToast?.('세션이 만료되었습니다. 다시 로그인해주세요.');
      } else if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
        console.warn('⚠️ 네트워크 오류 - Refresh Token 갱신 실패');
        showToast?.('네트워크 연결을 확인해주세요.');
        return false; // 네트워크 오류는 로그아웃하지 않음
      } else {
        showToast?.('인증 오류가 발생했습니다.');
      }

      await logout();
      return false;
    }
  };

  // 토큰 유효성 검증 및 사용자 정보 로드 함수
  const checkAuthStatus = async (): Promise<boolean> => {
    const token = getStoredAccessToken();

    if (!token) {
      // Access Token이 없으면 Refresh Token으로 시도
      const canRefresh = await refreshAccessToken();
      if (canRefresh) {
        // 토큰 갱신 성공 시 사용자 정보도 로드
        await loadUserInfo();
        return true;
      }

      setAuthenticated(false);
      return false;
    }

    try {
      console.log('🔍 AuthProvider: 토큰 유효성 검증 및 사용자 정보 로드 중...');

      // /users/me API로 토큰 검증과 사용자 정보 조회를 동시에
      const userInfo = await getUserInfo();

      if (userInfo) {
        setAccessToken(token);
        setAuthenticated(true);
        console.log('✅ AuthProvider: 토큰 유효성 검증 및 사용자 정보 로드 성공');
        return true;
      } else {
        // 사용자 정보 조회 실패 시 토큰 갱신 시도
        return await refreshAccessToken();
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { status?: number };
        code?: string;
      };

      if (axiosError.response?.status === 401) {
        // 401 에러면 Refresh Token으로 재시도
        console.log('🔄 AuthProvider: 401 에러 - Refresh Token으로 재시도');
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
          // 토큰 갱신 성공 시 사용자 정보도 로드
          await loadUserInfo();
        }
        return refreshSuccess;
      } else if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
        console.warn('⚠️ 네트워크 오류 - 토큰 검증 실패');
        showToast?.('네트워크 연결을 확인해주세요.');
        return false; // 네트워크 오류는 로그아웃하지 않음
      }

      console.error('❌ AuthProvider: 토큰 검증 실패:', error);
      await logout();
      return false;
    }
  };

  // 사용자 정보 로드 함수
  const loadUserInfo = async (): Promise<void> => {
    try {
      console.log('👤 AuthProvider: 사용자 정보 로드 시작...');
      const userInfo = await getUserInfo();
      if (userInfo) {
        console.log('✅ AuthProvider: 사용자 정보 로드 완료');
      }
    } catch (error) {
      console.error('❌ AuthProvider: 사용자 정보 로드 실패:', error);
    }
  };

  // 로그인 함수 (Access Token + Refresh Token + 사용자 정보 로드)
  const login = async (accessToken: string, refreshToken?: string): Promise<void> => {
    console.log('🚪 AuthProvider: 로그인 처리 중...');

    // 메모리에 토큰 저장
    setAccessToken(accessToken);
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }
    setAuthenticated(true);

    // 저장소에 토큰 저장
    setStoredTokens(accessToken, refreshToken || null);

    // 기존 localStorage 토큰 정리 (마이그레이션)
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('auth-storage');
    } catch (error) {
      console.warn('기존 토큰 정리 실패:', error);
    }

    // 사용자 정보 로드
    await loadUserInfo();

    console.log('✅ AuthProvider: 로그인 완료');
  };

  // 로그아웃 함수
  const logout = async (): Promise<void> => {
    console.log('🚪 AuthProvider: 로그아웃 처리 중...');

    try {
      // 1. 서버에 로그아웃 API 호출 (HttpOnly 쿠키 삭제)
      console.log('🌐 서버 로그아웃 요청 중...');
      await axiosInstance.post(
        '/auth/logout',
        {},
        {
          withCredentials: true, // HttpOnly 쿠키 포함해서 전송
        }
      );
      console.log('✅ 서버 로그아웃 완료 - HttpOnly 쿠키 삭제됨');
    } catch (error) {
      console.warn('⚠️ 서버 로그아웃 실패 (클라이언트 정리는 계속 진행):', error);
      // 서버 로그아웃 실패해도 클라이언트 정리는 계속 진행
    }

    // 2. 클라이언트 상태 정리 (메모리, sessionStorage, localStorage)
    storeLogout();
    console.log('✅ AuthProvider: 로그아웃 완료');
  };

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      setIsLoading(true);

      console.log('🔄 AuthProvider: 인증 상태 초기화 중...');

      // 기존 localStorage 토큰 마이그레이션
      const oldToken = localStorage.getItem('accessToken');
      const oldAuthStorage = localStorage.getItem('auth-storage');

      if (oldToken && !getStoredAccessToken()) {
        console.log('📦 기존 토큰 마이그레이션 중...');
        setAccessToken(oldToken);
        setStoredTokens(oldToken, null);
        localStorage.removeItem('accessToken');
      }

      if (oldAuthStorage && !getStoredAccessToken()) {
        try {
          const parsed = JSON.parse(oldAuthStorage) as {
            state?: {
              accessToken?: string;
              refreshToken?: string;
            };
          };
          if (parsed.state?.accessToken) {
            console.log('📦 기존 Zustand 토큰 마이그레이션 중...');
            setAccessToken(parsed.state.accessToken);
            setStoredTokens(parsed.state.accessToken, parsed.state.refreshToken || null);
          }
        } catch (e) {
          console.warn('기존 auth storage 파싱 실패:', e);
        }
        localStorage.removeItem('auth-storage');
      }

      // 인증 상태 확인 (사용자 정보도 함께 로드)
      await checkAuthStatus();

      setIsLoading(false);
      console.log('✅ AuthProvider: 인증 상태 초기화 완료');
    };

    initializeAuth();
  }, []);

  // 로딩 중일 때 로딩 스크린 표시
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <LoadingSpinner size="xl" />
        <p className="mt-6 text-base font-regular text-gray-700">애플리케이션 초기화 중...</p>
      </div>
    );
  }

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
    refreshAccessToken,
    userInfo,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
