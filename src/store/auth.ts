import { create } from 'zustand';

interface UserInfo {
  userId: number;
  email: string;
  username: string; // 실제 API에서는 username 필드 사용
  membershipCode: 'BASIC' | 'VIP' | 'VVIP'; // 실제 API 구조에 맞춤
  gender?: 'M' | 'F';
  birthdate?: string;
  tel?: string;
  barcodeNumber?: string;
  provider?: 'GOOGLE' | 'KAKAO' | 'NAVER';
  isProfileComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  // 메모리에 저장 (보안)
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;

  // Actions
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setUserInfo: (userInfo: UserInfo | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  updateUserInfo: (partialUserInfo: Partial<UserInfo>) => void; // 부분 업데이트 기능 추가
  logout: () => void;

  // Token 관리 유틸리티
  getStoredAccessToken: () => string | null;
  getStoredRefreshToken: () => string | null;
  setStoredTokens: (accessToken: string | null, refreshToken: string | null) => void;
  clearStoredTokens: () => void;

  // 사용자 정보 유틸리티
  getUserDisplayName: () => string; // 사용자 표시명 반환
  getUserGrade: () => 'BASIC' | 'VIP' | 'VVIP'; // 사용자 등급 반환
  getBarcodeNumber: () => string; // 바코드 번호 반환
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // 상태
  accessToken: null,
  refreshToken: null,
  userInfo: null,
  isAuthenticated: false,

  // 액션들
  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  setRefreshToken: (token) => {
    set({ refreshToken: token });
  },

  setUserInfo: (userInfo) => {
    set({ userInfo });
    console.log('✅ 사용자 정보 업데이트:', userInfo);
  },

  updateUserInfo: (partialUserInfo) => {
    const currentUserInfo = get().userInfo;
    if (currentUserInfo) {
      const updatedUserInfo = { ...currentUserInfo, ...partialUserInfo };
      set({ userInfo: updatedUserInfo });
      console.log('✅ 사용자 정보 부분 업데이트:', updatedUserInfo);
    }
  },

  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  logout: () => {
    set({
      accessToken: null,
      refreshToken: null,
      userInfo: null,
      isAuthenticated: false,
    });
    get().clearStoredTokens();
    console.log('🚪 사용자 정보 및 토큰 초기화 완료');
  },

  // 사용자 정보 유틸리티
  getUserDisplayName: () => {
    const userInfo = get().userInfo;
    if (userInfo?.username) {
      return userInfo.username;
    }
    return '유니어'; // 기본값
  },

  getUserGrade: () => {
    const userInfo = get().userInfo;
    return userInfo?.membershipCode || 'BASIC'; // 기본값
  },

  getBarcodeNumber: () => {
    const userInfo = get().userInfo;
    return userInfo?.barcodeNumber || '123456789'; // 기본값
  },

  // 토큰 저장 유틸리티 (보안 개선)
  getStoredAccessToken: () => {
    // 1순위: 메모리에서 가져오기
    const memoryToken = get().accessToken;
    if (memoryToken) return memoryToken;

    // 2순위: sessionStorage에서 가져오기 (새로고침 대응)
    try {
      const storedToken = sessionStorage.getItem('temp_access_token');
      if (storedToken) {
        // 메모리에도 복원
        get().setAccessToken(storedToken);
        return storedToken;
      }
      return null;
    } catch (error) {
      console.warn('AccessToken 조회 실패:', error);
      return null;
    }
  },

  getStoredRefreshToken: () => {
    // 1순위: 메모리에서 가져오기
    const memoryToken = get().refreshToken;
    if (memoryToken) return memoryToken;

    // 2순위: localStorage에서 가져오기 (Refresh Token은 더 오래 저장)
    try {
      const storedToken = localStorage.getItem('refresh_token');
      if (storedToken) {
        // 메모리에도 복원
        get().setRefreshToken(storedToken);
        return storedToken;
      }
      return null;
    } catch (error) {
      console.warn('RefreshToken 조회 실패:', error);
      return null;
    }
  },

  setStoredTokens: (accessToken, refreshToken) => {
    try {
      // Access Token: sessionStorage (짧은 생명주기)
      if (accessToken) {
        sessionStorage.setItem('temp_access_token', accessToken);
      } else {
        sessionStorage.removeItem('temp_access_token');
      }

      // Refresh Token: localStorage (긴 생명주기)
      if (refreshToken) {
        // 향후 암호화 적용 가능 지점
        localStorage.setItem('refresh_token', refreshToken);
      } else {
        localStorage.removeItem('refresh_token');
      }

      console.log('✅ 토큰 저장 완료');
    } catch (error) {
      console.error('❌ Token storage failed:', error);
      // 저장 실패 시에도 메모리에는 유지
      if (accessToken) get().setAccessToken(accessToken);
      if (refreshToken) get().setRefreshToken(refreshToken);
    }
  },

  clearStoredTokens: () => {
    try {
      // 모든 토큰 제거 (기존 + 새로운 방식)
      const keysToRemove = [
        'accessToken', // 기존 방식
        'refresh_token', // 새로운 방식
        'auth-storage', // Zustand persist
        'temp_access_token', // sessionStorage
      ];

      // localStorage 정리
      keysToRemove.forEach((key) => {
        if (key === 'temp_access_token') {
          sessionStorage.removeItem(key);
        } else {
          localStorage.removeItem(key);
        }
      });

      console.log('✅ 모든 저장된 토큰 정리 완료');
    } catch (error) {
      console.error('❌ Token cleanup failed:', error);
    }
  },
}));
