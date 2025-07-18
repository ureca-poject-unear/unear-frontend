import React, { useState } from 'react';
import ActionButton from '../components/common/ActionButton';

const LoginPage = () => {
  // 이메일, 비밀번호 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 이메일과 비밀번호가 모두 입력되면 로그인 버튼 활성화
  const isLoginActive = email.trim() !== '' && password.trim() !== '';

  // 비밀번호 보임/숨김 토글 함수
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // 로그인 버튼 클릭 시 API 호출 함수
  const handleActionClick = async () => {
    try {
      const response = await fetch('/api/app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`로그인 실패: ${errorData.message || '알 수 없는 오류'}`);
        return;
      }

      const data = await response.json();
      alert('로그인 성공!');
      console.log('로그인 응답 데이터:', data);

      // TODO: 로그인 성공 후 토큰 저장, 페이지 이동 등 추가 처리
    } catch (error) {
      alert('네트워크 오류가 발생했습니다.');
      console.error(error);
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
          className="w-full h-10 border-b border-zinc-300 text-black placeholder-zinc-400 focus:outline-none bg-transparent font-regular text-m"
        />

        {/* 비밀번호 입력 + 눈 아이콘 */}
        <div className="relative mt-6">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 border-b border-zinc-300 text-black placeholder-zinc-400 focus:outline-none pr-10 bg-transparent font-regular text-m"
          />

          {/* 눈 아이콘 */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-0 top-2"
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
        <ActionButton text="로그인" onClick={handleActionClick} isActive={isLoginActive} />
      </div>

      {/* 간편 로그인 텍스트 */}
      <div className="absolute top-[568px] left-1/2 transform -translate-x-1/2 w-[340px]">
        <p className="text-sm font-light text-center text-zinc-400">간편 로그인</p>
      </div>

      {/* 소셜 로그인 버튼들 */}
      <div className="absolute top-[596.5px] left-1/2 transform -translate-x-1/2 flex justify-center gap-10">
        <img
          src="data:image/png;base64,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"
          className="w-10 h-10 object-cover rounded-full"
          alt="네이버 로그인"
        />
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlsdsNDm5BOZKvhE2JEaNHkEp65Ebs4gkYxQ&s"
          className="w-10 h-10 object-cover rounded-full"
          alt="카카오 로그인"
        />
        <img
          src="data:image/png;base64,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"
          className="w-10 h-10 object-cover rounded-full"
          alt="구글 로그인"
        />
      </div>
    </div>
  );
};

export default LoginPage;
