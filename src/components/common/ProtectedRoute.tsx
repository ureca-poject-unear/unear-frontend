import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthStore } from '@/store/auth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { showWarningToast } from '@/utils/toast';
import { isTokenExpired, isTokenExpiringSoon } from '@/utils/tokenUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, refreshAccessToken } = useAuth();
  const { getStoredAccessToken } = useAuthStore();
  const location = useLocation();
  const [isCheckingToken, setIsCheckingToken] = useState(false);
  const lastCheckedPath = useRef<string>('');
  const isChecking = useRef<boolean>(false);
  const [isOAuthTransition, setIsOAuthTransition] = useState(false);

  // OAuth 리다이렉트 후 전환 상태 감지
  useEffect(() => {
    const checkOAuthTransition = () => {
      const referrer = document.referrer;
      const isFromOAuth =
        referrer.includes('/login/oauth2/code/') ||
        sessionStorage.getItem('oauth_redirect_in_progress') === 'true';

      if (isFromOAuth) {
        setIsOAuthTransition(true);
        // 2초 후 전환 상태 해제
        setTimeout(() => {
          setIsOAuthTransition(false);
          sessionStorage.removeItem('oauth_redirect_in_progress');
        }, 2000);
      }
    };

    if (!isLoading) {
      checkOAuthTransition();
    }
  }, [isLoading]);

  // 페이지 접근 시 토큰 만료 시간 체크 (JWT 디코딩 기반)
  useEffect(() => {
    const checkTokenExpiration = async (): Promise<void> => {
      // 로딩 중이거나 인증되지 않은 상태면 건너뛰기
      if (isLoading || !isAuthenticated) {
        return;
      }

      // 이미 같은 경로에서 확인했거나 현재 확인 중이면 건너뛰기
      if (lastCheckedPath.current === location.pathname || isChecking.current) {
        return;
      }

      const token = getStoredAccessToken();
      if (!token) {
        console.warn('⚠️ ProtectedRoute: 저장된 토큰이 없음');
        return;
      }

      // 확인 중 플래그 설정
      isChecking.current = true;
      lastCheckedPath.current = location.pathname;
      setIsCheckingToken(true);

      try {
        // 토큰이 만료되었는지 확인 (JWT 디코딩)
        if (isTokenExpired(token)) {
          console.log('🔄 ProtectedRoute: 토큰이 만료됨 - 자동 갱신 시도');
          const refreshSuccess = await refreshAccessToken();
          if (!refreshSuccess) {
            console.error('❌ ProtectedRoute: 토큰 갱신 실패');
            return; // 실패 시 AuthProvider에서 로그아웃 처리
          }
        }
        // 토큰이 곧 만료될 예정인지 확인 (5분 이내)
        else if (isTokenExpiringSoon(token, 300)) {
          console.log('⚠️ ProtectedRoute: 토큰이 곧 만료됨 - 미리 갱신');
          showWarningToast('세션이 곧 만료됩니다. 자동으로 갱신합니다.');
          await refreshAccessToken();
        }
        // 토큰이 유효한 경우 추가 확인 생략
        else {
          console.log('✅ ProtectedRoute: 토큰이 유효함');
        }
      } catch (error: unknown) {
        console.error('❌ ProtectedRoute: 토큰 확인 실패:', error);
        // 에러 발생 시도 AuthProvider에서 처리됨
      } finally {
        setIsCheckingToken(false);
        isChecking.current = false;
      }
    };

    // 초기 로딩이 완료된 후에만 실행
    if (!isLoading) {
      checkTokenExpiration();
    }
  }, [location.pathname, isLoading, isAuthenticated, refreshAccessToken, getStoredAccessToken]);

  // 로딩 중이거나 OAuth 전환 중일 때
  if (isLoading || isCheckingToken || isOAuthTransition) {
    const loadingMessage = isLoading
      ? '애플리케이션 초기화 중...'
      : isOAuthTransition
        ? '로그인 완료 처리 중...'
        : '토큰 유효성 확인 중...';

    return (
      <div className="bg-background">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm font-regular text-gray-600">
            {loadingMessage}
          </p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트 (OAuth 전환 중이 아닐 때만)
  if (!isAuthenticated && !isOAuthTransition) {
    console.log('🚪 ProtectedRoute: 인증되지 않음 - 로그인 페이지로 이동');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default ProtectedRoute;
