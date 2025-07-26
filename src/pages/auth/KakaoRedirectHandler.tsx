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

const KakaoRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasProcessed = useRef(false); // 중복 실행 방지

  useEffect(() => {
    // 이미 처리했거나 처리 중이면 무시
    if (hasProcessed.current || isProcessing) {
      return;
    }

    const handleKakaoLogin = async (): Promise<void> => {
      // 처리 시작 플래그 설정
      hasProcessed.current = true;
      setIsProcessing(true);

      try {
        // URL에서 'code' 파라미터(인가 코드)를 추출합니다.
        const code = searchParams.get('code');

        if (!code) {
          throw new Error('로그인에 실패했습니다. (인가 코드 없음)');
        }

        console.log('카카오 인가 코드:', code);

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
            // AuthProvider의 login 함수 사용
            await login(data.data.accessToken, data.data.refreshToken);
            alert('카카오 로그인 성공!');

            // 메인 페이지로 리다이렉트
            navigate('/', { replace: true });
            console.log('✅ 메인페이지로 이동합니다.');
          } else {
            throw new Error('백엔드에서 accessToken을 받지 못했습니다.');
          }
        } else {
          console.error('❌ 백엔드 로그인 처리 실패:', data);
          throw new Error(data.message || '카카오 로그인에 실패했습니다.');
        }
      } catch (error: unknown) {
        console.error('카카오 로그인 처리 중 오류 발생:', error);

        const loginError = error as LoginError;
        setError(loginError.message || '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');

        // 에러 발생 시 3초 후 로그인 페이지로 이동
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleKakaoLogin();
  }, []); // 의존성 배열 비움 - 한 번만 실행

  // 에러 발생 시 화면
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">카카오 로그인 오류</h1>
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
        <h1 className="text-xl font-semibold text-gray-800 mb-3">카카오 로그인 처리 중</h1>
        <p className="text-gray-600">사용자 정보를 불러오고 있습니다...</p>

        <div className="mt-8 text-xs text-gray-400">U:NEAR에 로그인하고 있습니다</div>
      </div>
    </div>
  );
};

export default KakaoRedirectHandler;
