import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../components/common/ActionButton';
import { useAuthStore } from '../store/auth';

// 1. 이 부분을 import.meta.env로 수정합니다.
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const navigate = useNavigate();

  const isLoginActive = email.trim() !== '' && password.trim() !== '' && !isLoading;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleActionClick = async () => {
    if (!isLoginActive) return;

    setIsLoading(true);
    setErrorMessage(null);

    const apiUrl =
      import.meta.env.MODE === 'production'
        ? 'https://api.unear.site/api/app/auth/login'
        : 'https://dev.unear.site/api/app/auth/login';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        handleErrorResponse(data, response.status);
        return;
      }

      if (data.codeName === 'SUCCESS' || data.resultCode === 200) {
        console.log('로그인 응답 데이터:', data);

        if (data.data?.accessToken) {
          setAccessToken(data.data.accessToken);
        }

        alert('로그인 성공!');

        setTimeout(() => {
          try {
            navigate('/', { replace: true });
            console.log('✅ navigate 호출 완료 - 메인페이지로 이동');
          } catch (error) {
            console.error('❌ navigate 오류:', error);
            window.location.href = '/';
          }
        }, 100);
      } else {
        console.log('❌ 로그인 실패 - 응답 구조:', data);
        handleErrorResponse(data, response.status);
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
      alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrorResponse = (data: any, statusCode: number) => {
    let errorMessage = '알 수 없는 오류가 발생했습니다.';

    if (data.codeName) {
      switch (data.codeName) {
        case 'INVALID_PASSWORD':
          errorMessage = '비밀번호가 올바르지 않습니다.';
          break;
        case 'U404':
          errorMessage = '사용자를 찾을 수 없습니다.';
          break;
        default:
          errorMessage = data.message || '로그인에 실패했습니다.';
      }
    } else if (data.message) {
      errorMessage = data.message;
    } else {
      switch (statusCode) {
        case 401:
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
          break;
        case 500:
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          break;
        default:
          errorMessage = '로그인에 실패했습니다.';
      }
    }

    setErrorMessage(errorMessage);
    console.error('로그인 에러:', data);
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleFindAccount = () => {
    navigate('/find-account');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isLoginActive) {
      handleActionClick();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center font-['Inter']">
      {/* 타이틀 */}
      <p className="absolute top-[171px] left-1/2 transform -translate-x-1/2 text-[32px] font-bold text-center whitespace-nowrap">
        <span className="text-primary">U:NEAR</span>
        <span className="text-black"> 로그인</span>
      </p>

      <p className="absolute top-[231px] left-1/2 transform -translate-x-1/2 w-[296px] text-m text-center text-black">
        로그인하고 유니어의 서비스를 경험해보세요!
      </p>

      {/* 입력 필드 영역 */}
      <div className="absolute top-[303px] left-1/2 transform -translate-x-1/2 w-[351px]">
        {/* 이메일 입력 */}
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full h-10 border-b border-zinc-300 text-black placeholder-zinc-400 focus:outline-none bg-transparent font-regular text-m disabled:opacity-50"
        />

        {/* 비밀번호 입력 + 눈 아이콘 */}
        <div className="relative mt-6">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="w-full h-10 border-b border-zinc-300 text-black placeholder-zinc-400 focus:outline-none pr-10 bg-transparent font-regular text-m disabled:opacity-50"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={isLoading}
            className="absolute right-0 top-2 disabled:opacity-50"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {/* ... SVG 아이콘 ... */}
          </button>
        </div>
      </div>

      {/* 로그인 버튼 */}
      <div className="absolute top-[438px] left-1/2 transform -translate-x-1/2">
        <ActionButton
          text={isLoading ? '로그인 중...' : '로그인'}
          onClick={handleActionClick}
          isActive={isLoginActive}
        />
      </div>

      {/* 오류 메시지 */}
      {errorMessage && (
        <div className="absolute top-[120px] left-1/2 transform -translate-x-1/2 w-[351px]">
          <p className="text-red-500 text-center text-sm">{errorMessage}</p>
        </div>
      )}

      {/* 아이디/비밀번호 찾기 및 회원가입 */}
      <div className="absolute top-[501px] left-0 right-0 w-full flex justify-center gap-8">
        <button
          onClick={handleFindAccount}
          disabled={isLoading}
          className="text-sm text-gray-600 whitespace-nowrap hover:text-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          아이디 / 비밀번호 찾기
        </button>
        <button
          onClick={handleSignUp}
          disabled={isLoading}
          className="text-sm text-gray-600 whitespace-nowrap hover:text-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          회원가입
        </button>
      </div>

      {/* 간편 로그인 텍스트 */}
      <div className="absolute top-[568px] left-1/2 transform -translate-x-1/2 w-[340px]">
        <p className="text-sm font-light text-center text-zinc-400">간편 로그인</p>
      </div>

      {/* 소셜 로그인 버튼들 */}
      <div className="absolute top-[596.5px] left-1/2 transform -translate-x-1/2 flex justify-center gap-10">
        <a href="/oauth2/authorization/naver" aria-label="네이버 로그인">
          <img
            src="https://test.codemshop.com/wp-content/plugins/mshop-mcommerce-premium-s2/lib/mshop-members-s2/assets/images/social/icon_1/Naver.png"
            className="w-20 h-25 object-cover rounded-full"
            alt="네이버 로그인"
          />
        </a>
        <a
          href="https://dev.unear.site/api/app/oauth2/authorization/kakao"
          aria-label="카카오 로그인"
        >
          <img
            src="https://test.codemshop.com/wp-content/plugins/mshop-mcommerce-premium-s2/lib/mshop-members-s2/assets/images/social/icon_1/Kakao.png"
            className="w-20 h-25 object-cover rounded-full"
            alt="카카오 로그인"
          />
        </a>
        <a
          href="https://dev.unear.site/api/app/oauth2/authorization/google"
          aria-label="구글 로그인"
        >
          <img
            src="https://test.codemshop.com/wp-content/plugins/mshop-mcommerce-premium-s2/lib/mshop-members-s2/assets/images/social/icon_1/Google.png"
            className="w-20 h-25 object-cover rounded-full"
            alt="구글 로그인"
          />
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
