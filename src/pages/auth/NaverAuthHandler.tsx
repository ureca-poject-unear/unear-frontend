import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import LoadingSpinner from '@/components/common/LoadingSpinner';

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

const NaverAuthHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current || isProcessing) {
      return;
    }

    const handleNaverLogin = async (): Promise<void> => {
      hasProcessed.current = true;
      setIsProcessing(true);

      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
          throw new Error('네이버 로그인 파라미터가 누락되었습니다.');
        }

        console.log('네이버 OAuth 처리 중...', { code, state });

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
          // AuthProvider의 login 함수 사용
          await login(result.data.accessToken, result.data.refreshToken);
          alert('네이버 로그인 성공!');

          // 메인 페이지로 리다이렉트
          navigate('/', { replace: true });
          console.log('✅ 메인페이지로 이동합니다.');
        } else {
          throw new Error('백엔드에서 accessToken을 받지 못했습니다.');
        }
      } catch (error: unknown) {
        console.error('네이버 로그인 오류:', error);

        const loginError = error as LoginError;
        setError(loginError.message || '네이버 로그인 중 오류가 발생했습니다.');

        // 에러 발생 시 3초 후 로그인 페이지로 이동
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleNaverLogin();
  }, [searchParams, navigate, login, isProcessing]);

  // 에러 발생 시 화면
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">네이버 로그인 오류</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm leading-relaxed">{error}</p>
            </div>
            <p className="text-gray-600 text-sm">3초 후 로그인 페이지로 자동 이동됩니다...</p>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 화면
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <LoadingSpinner size="xl" />
        </div>
        <h1 className="text-xl font-semibold text-gray-800 mb-3">네이버 로그인 처리 중</h1>
        <p className="text-gray-600">사용자 정보를 불러오고 있습니다...</p>

        <div className="mt-8 text-xs text-gray-400">U:NEAR에 로그인하고 있습니다</div>
      </div>
    </div>
  );
};

export default NaverAuthHandler;
