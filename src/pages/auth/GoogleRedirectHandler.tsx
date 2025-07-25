// src/pages/auth/GoogleRedirectHandler.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// 사용자 정보 타입 정의
interface UserInfo {
  isProfileComplete?: boolean;
}

const GoogleRedirectHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasProcessed = useRef(false); // 중복 실행 방지

  useEffect(() => {
    // 이미 처리했거나 처리 중이면 무시
    if (hasProcessed.current || isProcessing) {
      return;
    }

    const handleGoogleLogin = async (): Promise<void> => {
      // 처리 시작 플래그 설정
      hasProcessed.current = true;
      setIsProcessing(true);

      try {
        // 1. URL에서 백엔드가 보내준 토큰을 추출합니다.
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken'); // 혹시 있다면

        console.log('🔍 Google OAuth 토큰 확인:', {
          accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null,
          refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : null,
        });

        if (!accessToken) {
          throw new Error('로그인에 실패했습니다. 토큰이 제공되지 않았습니다.');
        }

        // 2. AuthProvider의 login 함수를 사용하여 토큰을 저장하고 사용자 정보를 자동 로드
        console.log('🔄 로그인 처리 및 사용자 정보 로드 중...');
        await login(accessToken, refreshToken || undefined);

        console.log('✅ 로그인 및 사용자 정보 로드 완료');

        // 3. 잠시 대기 후 사용자 정보 확인을 위해 /me API 재호출
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 4. 사용자 정보 확인 후 적절한 페이지로 이동
        // AuthProvider에서 이미 사용자 정보를 로드했으므로 스토어에서 확인
        const { useAuthStore } = await import('@/store/auth');
        const userInfo = useAuthStore.getState().userInfo as UserInfo | null;

        if (userInfo?.isProfileComplete) {
          console.log('✅ 프로필 완성됨 - 메인페이지로 이동');
          navigate('/', { replace: true });
        } else {
          console.log('⚠️ 프로필 미완성 - 완성 페이지로 이동');
          alert('서비스 이용을 위해 추가 정보 입력이 필요합니다.');
          navigate('/complete-profile', { replace: true });
        }
      } catch (error: unknown) {
        console.error('❌ 구글 로그인 처리 중 오류:', error);

        const axiosError = error as {
          response?: {
            status?: number;
            data?: {
              message?: string;
            };
          };
          request?: unknown;
          message?: string;
        };

        let errorMessage = '구글 로그인 처리 중 오류가 발생했습니다.';

        if (axiosError.response) {
          // 서버 응답 에러
          console.error('서버 응답 에러:', {
            status: axiosError.response.status,
            data: axiosError.response.data,
          });

          if (axiosError.response.status === 401) {
            errorMessage = '인증에 실패했습니다. 토큰이 유효하지 않습니다.';
          } else if (axiosError.response.status === 404) {
            errorMessage = '사용자 정보를 찾을 수 없습니다.';
          } else if (axiosError.response.status && axiosError.response.status >= 500) {
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          } else {
            errorMessage = `서버 오류 (${axiosError.response.status}): ${axiosError.response.data?.message || '알 수 없는 오류'}`;
          }
        } else if (axiosError.request) {
          // 네트워크 에러
          console.error('네트워크 에러:', axiosError.request);
          errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
        } else {
          // 기타 에러
          errorMessage = axiosError.message || '알 수 없는 오류가 발생했습니다.';
        }

        setError(errorMessage);

        // 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleGoogleLogin();
  }, []); // 의존성 배열 비움 - 한 번만 실행

  // 에러 발생 시 화면
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">구글 로그인 오류</h1>
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
        <h1 className="text-xl font-semibold text-gray-800 mb-3">구글 로그인 처리 중</h1>
        <p className="text-gray-600">사용자 정보를 불러오고 있습니다...</p>

        {/* 브랜드 로고나 추가 정보가 필요하다면 여기에 */}
        <div className="mt-8 text-xs text-gray-400">U:NEAR에 로그인하고 있습니다</div>
      </div>
    </div>
  );
};

export default GoogleRedirectHandler;
