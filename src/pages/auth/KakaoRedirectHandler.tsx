import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// 환경변수에서 API 도메인 가져오기
const API_DOMAIN = import.meta.env.VITE_API_BASE_URL || 'https://dev.unear.site';

// API 응답 타입 정의
interface KakaoLoginResponse {
  codeName?: string;
  resultCode?: number;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

// 에러 타입 정의
interface LoginError {
  message?: string;
}

// 사용자 정보 타입 정의
interface UserInfo {
  isProfileComplete?: boolean;
}

const KakaoRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, checkAuthStatus } = useAuth();
  const [loadingMessage, setLoadingMessage] = useState('카카오 로그인 처리 중...');
  const [hasError, setHasError] = useState(false);
  const hasProcessed = useRef(false); // 중복 실행 방지

  useEffect(() => {
    // 이미 처리했으면 무시
    if (hasProcessed.current) {
      return;
    }

    const handleKakaoLogin = async (): Promise<void> => {
      // 처리 시작 플래그 설정
      hasProcessed.current = true;

      try {
        setLoadingMessage('카카오 인가 코드 확인 중...');
        
        // URL에서 'code' 파라미터(인가 코드)를 추출합니다.
        const code = searchParams.get('code');

        if (!code) {
          throw new Error('로그인에 실패했습니다. (인가 코드 없음)');
        }

        console.log('카카오 인가 코드:', code);

        setLoadingMessage('카카오 서버와 연동 중...');
        
        // 환경변수를 사용한 API URL
        const apiUrl = `${API_DOMAIN}/login/oauth2/code/kakao`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const data = (await response.json()) as KakaoLoginResponse;

        if (response.ok && (data.codeName === 'SUCCESS' || data.resultCode === 200)) {
          console.log('백엔드 응답 데이터:', data);

          if (data.data?.accessToken) {
            setLoadingMessage('사용자 정보를 불러오는 중...');
            
            // AuthProvider의 login 함수 사용
            await login(data.data.accessToken, data.data.refreshToken);
            console.log('✅ 카카오 로그인 및 사용자 정보 로드 완료');

            // 인증 상태 확인 (네트워크 에러 시 간단한 대기 후 진행)
            setLoadingMessage('인증 상태 확인 중...');
            
            // 짧은 대기 시간으로 AuthProvider 상태 업데이트 보장
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            // 사용자 정보 확인 후 적절한 페이지로 이동
            setLoadingMessage('페이지 이동 준비 중...');
            const { useAuthStore } = await import('@/store/auth');
            const userInfo = useAuthStore.getState().userInfo as UserInfo | null;
            
            if (userInfo?.isProfileComplete) {
              console.log('✅ 프로필 완성됨 - 메인페이지로 이동');
              setLoadingMessage('메인 페이지로 이동 중...');
              
              // OAuth 리다이렉트 진행 중 플래그 설정
              sessionStorage.setItem('oauth_redirect_in_progress', 'true');
              
              navigate('/', { replace: true });
            } else {
              console.log('⚠️ 프로필 미완성 - 완성 페이지로 이동');
              setLoadingMessage('프로필 설정 페이지로 이동 중...');
              
              // OAuth 리다이렉트 진행 중 플래그 설정
              sessionStorage.setItem('oauth_redirect_in_progress', 'true');
              
              navigate('/complete-profile', { replace: true });
            }
          } else {
            throw new Error('백엔드에서 accessToken을 받지 못했습니다.');
          }
        } else {
          console.error('❌ 백엔드 로그인 처리 실패:', data);
          throw new Error(data.message || '카카오 로그인에 실패했습니다.');
        }
      } catch (error: unknown) {
        console.error('❌ 카카오 로그인 처리 중 오류:', error);
        setHasError(true);
        
        const loginError = error as LoginError;
        const errorMessage = loginError.message || '카카오 로그인 처리 중 오류가 발생했습니다.';
        
        setLoadingMessage(errorMessage);
        
        // 에러 발생 시 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleKakaoLogin();
  }, []); // 의존성 배열 비움 - 한 번만 실행

  // 카카오 로그인 처리 중 로딩 화면 표시
  return (
    <>
      <div className="bg-background">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm font-regular text-gray-600" style={{ color: hasError ? '#6B7280' : '#6B7280' }}>
            {loadingMessage}
          </p>
        </div>
      </div>
    </>
  );
};

export default KakaoRedirectHandler;
