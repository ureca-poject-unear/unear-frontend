import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import axiosInstance from '@/apis/axiosInstance';

// API 응답 타입 정의
interface NaverLoginResponse {
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

const NaverAuthHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loadingMessage, setLoadingMessage] = useState('네이버 로그인 처리 중...');
  const [hasError, setHasError] = useState(false);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }

    const handleNaverLogin = async (): Promise<void> => {
      hasProcessed.current = true;

      try {
        setLoadingMessage('네이버 인가 코드 확인 중...');

        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
          throw new Error('네이버 로그인 파라미터가 누락되었습니다.');
        }

        console.log('네이버 OAuth 처리 중...', { code, state });

        setLoadingMessage('네이버 서버와 연동 중...');

        // 백엔드에 Naver code 전달하여 토큰 받아오기
        const response = await fetch('https://dev.unear.site/api/auth/naver', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
        });

        const result = (await response.json()) as NaverLoginResponse;

        if (!response.ok) {
          throw new Error(result.message || '네이버 로그인에 실패했습니다.');
        }

        console.log('네이버 로그인 성공:', result);

        if (result.data?.accessToken) {
          setLoadingMessage('사용자 정보를 불러오는 중...');

          // AuthProvider의 login 함수 사용
          await login(result.data.accessToken, result.data.refreshToken);
          console.log('✅ 네이버 로그인 및 사용자 정보 로드 완료');

          // 인증 상태 확인
          setLoadingMessage('인증 상태 확인 중...');

          // 짧은 대기 시간으로 AuthProvider 상태 업데이트 보장
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // 프로필 완료 상태를 직접 API로 확인 (AuthProvider 상태 대신)
          setLoadingMessage('프로필 상태 확인 중...');

          try {
            const userResponse = await axiosInstance.get('/users/me');
            const userData = userResponse.data.data;

            console.log('🔍 직접 API로 사용자 정보 확인:', {
              isProfileComplete: userData.isProfileComplete,
              username: userData.username,
            });

            // OAuth 리다이렉트 진행 중 플래그 설정
            sessionStorage.setItem('oauth_redirect_in_progress', 'true');
            sessionStorage.setItem('profile_check_completed', 'true'); // 프로필 확인 완료 플래그

            // 프로필 완성 여부에 따라 즉시 분기
            if (userData.isProfileComplete === true) {
              console.log('✅ 프로필 완성됨 - 메인페이지로 즉시 이동');
              setLoadingMessage('메인 페이지로 이동 중...');
              navigate('/', { replace: true });
            } else {
              console.log('⚠️ 프로필 미완성 - 완성 페이지로 이동');
              setLoadingMessage('추가 정보 입력 페이지로 이동 중...');
              navigate('/complete-profile', { replace: true });
            }
          } catch (apiError) {
            console.error('❌ 프로필 상태 확인 실패:', apiError);
            // API 실패 시 기본적으로 완성 페이지로 이동
            sessionStorage.setItem('oauth_redirect_in_progress', 'true');
            navigate('/complete-profile', { replace: true });
          }
        } else {
          throw new Error('백엔드에서 accessToken을 받지 못했습니다.');
        }
      } catch (error: unknown) {
        console.error('❌ 네이버 로그인 처리 중 오류:', error);
        setHasError(true);

        const loginError = error as LoginError;
        const errorMessage = loginError.message || '네이버 로그인 처리 중 오류가 발생했습니다.';

        setLoadingMessage(errorMessage);

        // 에러 발생 시 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleNaverLogin();
  }, []); // 의존성 배열 비움 - 한 번만 실행

  // 네이버 로그인 처리 중 로딩 화면 표시
  return (
    <>
      <div className="bg-background">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
          <LoadingSpinner size="lg" />
          <p
            className="mt-4 text-sm font-regular text-gray-600"
            style={{ color: hasError ? '#6B7280' : '#6B7280' }}
          >
            {loadingMessage}
          </p>
        </div>
      </div>
    </>
  );
};

export default NaverAuthHandler;
