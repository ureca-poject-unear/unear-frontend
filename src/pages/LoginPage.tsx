import React, { useState } from 'react';
import ActionButton from '../components/common/ActionButton';

const LoginPage = () => {
  // 이메일, 비밀번호 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 이메일과 비밀번호가 모두 입력되면 로그인 버튼 활성화
  const isLoginActive = email.trim() !== '' && password.trim() !== '' && !isLoading;

  // 비밀번호 보임/숨김 토글 함수
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // 로그인 버튼 클릭 시 API 호출 함수
  const handleActionClick = async () => {
    if (!isLoginActive) return;

    setIsLoading(true);

    try {
      const response = await fetch('/auth/login', {
        // API 엔드포인트 수정
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 에러 응답 처리
        handleErrorResponse(data, response.status);
        return;
      }

      // 성공 응답 처리 (status가 SUCCESS인 경우)
      if (data.status === 'SUCCESS') {
        alert('로그인 성공!');
        console.log('로그인 응답 데이터:', data);

        // 토큰을 로컬 스토리지에 저장
        if (data.data?.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('username', data.data.username || '');
          localStorage.setItem('email', data.data.email || '');
        }

        // 메인 페이지로 이동
        window.location.href = '/main';
        // 또는 React Router를 사용하는 경우:
        // navigate('/main');
      } else {
        // SUCCESS가 아닌 응답도 에러로 처리
        handleErrorResponse(data, response.status);
      }
    } catch (error) {
      console.error('네트워크 오류:', error);
      alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  interface ErrorResponse {
    message?: string;
    codeName?: string;
    resultCode?: number;
    [key: string]: unknown; // 기타 키 허용
  }

  // 에러 응답 처리 함수
  const handleErrorResponse = (data: ErrorResponse, statusCode: number) => {
    let errorMessage = '알 수 없는 오류가 발생했습니다.';

    // API 명세에 따른 codeName 우선 처리
    if (data.codeName) {
      switch (data.codeName) {
        case 'U404':
          errorMessage = '사용자를 찾을 수 없습니다.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = '비밀번호가 올바르지 않습니다.';
          break;
        default:
          errorMessage = data.message || '로그인에 실패했습니다.';
      }
    } else if (data.message) {
      errorMessage = data.message;
    } else {
      // HTTP 상태 코드에 따른 기본 메시지
      switch (statusCode) {
        case 401:
          errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
          break;
        case 404:
          errorMessage = '사용자를 찾을 수 없습니다.';
          break;
        case 500:
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          break;
        default:
          errorMessage = '로그인에 실패했습니다.';
      }
    }

    alert(errorMessage);
    console.error('로그인 에러:', data);
  };

  // 회원가입 페이지로 이동
  const handleSignUp = () => {
    // React Router를 사용한다면:
    // navigate('/signup');
    // 또는 일반적인 페이지 이동:
    window.location.href = '/signup';
  };

  // 아이디/비밀번호 찾기 페이지로 이동
  const handleFindAccount = () => {
    // React Router를 사용한다면:
    // navigate('/find-account');
    // 또는 일반적인 페이지 이동:
    window.location.href = '/find-account';
  };

  // 엔터 키 처리 함수
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

          {/* 눈 아이콘 */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={isLoading}
            className="absolute right-0 top-2 disabled:opacity-50"
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#A1A1AA"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5.25 12 5.25s8.268 2.693 9.542 6.75c-1.274 4.057-5.065 6.75-9.542 6.75S3.732 16.057 2.458 12z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#A1A1AA"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.458 12c1.274 4.057 5.065 6.75 9.542 6.75 1.493 0 2.91-.348 4.208-.97M8.25 15a3.75 3.75 0 005.25-5.25M12 5.25c1.493 0 2.91.348 4.208.97A10.477 10.477 0 0122.542 12a10.45 10.45 0 01-1.852 3.045M3 3l18 18"
                />
              </svg>
            )}
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
        {/* 네이버 로그인 */}
        <a href="/oauth2/authorization/naver" aria-label="네이버 로그인">
          <img
            src="https://test.codemshop.com/wp-content/plugins/mshop-mcommerce-premium-s2/lib/mshop-members-s2/assets/images/social/icon_1/Naver.png"
            className="w-20 h-25 object-cover rounded-full"
            alt="네이버 로그인"
          />
        </a>
        {/* 카카오 로그인 */}
        <a href="/oauth2/authorization/kakao" aria-label="카카오 로그인">
          <img
            src="https://test.codemshop.com/wp-content/plugins/mshop-mcommerce-premium-s2/lib/mshop-members-s2/assets/images/social/icon_1/Kakao.png"
            className="w-20 h-25 object-cover rounded-full"
            alt="카카오 로그인"
          />
        </a>
        {/* 구글 로그인 */}
        <a href="/oauth2/authorization/google" aria-label="구글 로그인">
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
