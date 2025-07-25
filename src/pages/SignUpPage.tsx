import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/common/Header';
import ToggleButton from '../components/common/ToggleButton'; // 경로에 맞게 조정
import ConfirmButton from '../components/common/ConfirmButton';

const SignUpPage = () => {
  // --- 기존 상태(State) 및 변수 선언 (변경 없음) ---
  const [form, setForm] = useState({
    name: '',
    gender: '남자',
    birth: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const [emailVerificationTimer, setEmailVerificationTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  const [emailExistsError, setEmailExistsError] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const isSignUpActive =
    form.name.trim() !== '' &&
    form.gender.trim() !== '' &&
    form.birth.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.email.trim() !== '' &&
    form.password.trim() !== '' &&
    form.confirmPassword.trim() !== '' &&
    !passwordMismatch &&
    isEmailVerified;

  // --- 기존 핸들러 및 헬퍼 함수 (변경 없음) ---
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prevForm) => {
      const newForm = { ...prevForm, [field]: value };
      if (field === 'password' || field === 'confirmPassword') {
        if (newForm.password && newForm.confirmPassword) {
          setPasswordMismatch(newForm.password !== newForm.confirmPassword);
        } else {
          setPasswordMismatch(false);
        }
      }
      if (field === 'email') {
        setEmailExistsError(false);
        setIsEmailVerified(false);
      }
      return newForm;
    });
  };

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    setVerificationCodeError(false);
  };

  // --- API 연동 부분 수정 ---

  // 이메일 인증 요청 및 타이머 시작 함수 (이전과 동일)
  const handleEmailVerificationRequest = async () => {
    if (!form.email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://dev.unear.site/api/app/auth/send-code?email=${encodeURIComponent(form.email)}`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        setEmailExistsError(false);
        setShowEmailVerification(true);
        setEmailVerificationTimer(240);
        setIsTimerRunning(true);
        setIsEmailVerified(false);
        alert('인증번호가 전송되었습니다.');
      } else {
        const result = await response.json();
        if (result.codeName === 'DUPLICATED_EMAIL') {
          setEmailExistsError(true);
        } else {
          alert(result.message || '인증번호 전송에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('이메일 인증번호 전송 실패:', error);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // [수정된 부분] 이메일 인증번호 확인 함수
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://dev.unear.site/api/app/auth/verify-code?email=${encodeURIComponent(
          form.email
        )}&code=${encodeURIComponent(verificationCode)}`,
        {
          method: 'POST',
        }
      );

      // response.ok가 true이면 성공으로 간주하고, JSON 파싱을 시도하지 않습니다.
      if (response.ok) {
        setVerificationCodeError(false);
        setIsTimerRunning(false);
        setIsEmailVerified(true);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        alert('이메일 인증이 완료되었습니다!');
      } else {
        // response.ok가 false인 경우에만 JSON 파싱을 시도합니다. (에러 메시지 처리)
        const result = await response.json();
        setVerificationCodeError(true);
        alert(result.message || '인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('이메일 인증 실패:', error);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 타이머 로직 (변경 없음)
  useEffect(() => {
    if (isTimerRunning && emailVerificationTimer > 0) {
      timerIntervalRef.current = window.setInterval(() => {
        setEmailVerificationTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (emailVerificationTimer === 0) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setIsTimerRunning(false);
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, emailVerificationTimer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds.toString().padStart(2, '0')}초`;
  };

  const formatBirthdate = (birthString: string) => {
    if (birthString.length === 8) {
      const year = birthString.substring(0, 4);
      const month = birthString.substring(4, 6);
      const day = birthString.substring(6, 8);
      return `${year}-${month}-${day}T00:00:00`;
    }
    return birthString;
  };

  // 회원가입 제출 함수 (변경 없음)
  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);

    setIsLoading(true);
    try {
      const signupData = {
        email: form.email,
        password: form.password,
        username: form.name,
        tel: form.phone,
        birthdate: formatBirthdate(form.birth),
        gender: form.gender === '남자' ? 'M' : 'F',
      };

      const response = await fetch('http://dev.unear.site/api/app/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();

      if (response.ok && result.resultCode === 200) {
        alert(`회원가입이 완료되었습니다! 환영합니다, ${result.data.username}님!`);
        window.location.href = '/login';
      } else {
        if (result.codeName === 'INVALID_INPUT_VALUE' && result.data?.fieldErrors) {
          const fieldErrors = result.data.fieldErrors;
          let errorMessage = '입력값을 확인해주세요:\n';
          Object.entries(fieldErrors).forEach(([, message]) => {
            errorMessage += `- ${message}\n`;
          });
          alert(errorMessage);
        } else if (result.codeName === 'DUPLICATED_EMAIL') {
          setEmailExistsError(true);
          alert(result.message);
        } else {
          alert(result.message || '회원가입에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX 렌더링 부분 (변경 없음) ---
  return (
    <>
      <Header title="회원가입" />
      <div className="mt-[25px]">
        <div className="px-5 flex flex-col gap-6 ">
          {/* 이름 */}
          <div>
            <label className="text-lm font-bold text-black">이름</label>
            <input
              type="text"
              placeholder="이름"
              value={form.name}
              onChange={handleChange('name')}
              className="w-full h-10 border-b border-zinc-300 text-black placeholder-zinc-400 focus:outline-none bg-transparent font-regular text-m"
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="text-lm font-bold text-black">성별</label>
            <div className="flex gap-4 mt-2">
              {['남자', '여자'].map((g) => (
                <ToggleButton
                  key={g}
                  text={g}
                  isActive={form.gender === g}
                  onClick={() => {
                    if (form.gender === g) {
                      setForm({ ...form, gender: '' }); // 해제
                    } else {
                      setForm({ ...form, gender: g }); // 선택
                    }
                  }}
                />
              ))}
            </div>
          </div>

          {/* 생년월일 */}
          <div>
            <label className="text-lm font-bold text-black">생년월일</label>
            <input
              type="text"
              placeholder="예: 19940508"
              value={form.birth}
              onChange={handleChange('birth')}
              className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="text-lm font-bold text-black">전화번호</label>
            <input
              type="text"
              placeholder="'-' 포함 입력 (예: 010-1234-5678)"
              value={form.phone}
              onChange={handleChange('phone')}
              className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* 이메일 섹션 시작 */}
          <div>
            <label className="text-lm font-bold text-black">이메일</label>
            <div className="flex justify-between items-center border-b border-zinc-300">
              <input
                type="email"
                placeholder="예: unear@google.com"
                value={form.email}
                onChange={handleChange('email')}
                className="flex-1 text-zinc-700 placeholder-zinc-400 focus:outline-none py-1 bg-transparent"
              />
              <ConfirmButton
                text={isTimerRunning ? '재전송' : '이메일인증'}
                onClick={handleEmailVerificationRequest}
                disabled={(isTimerRunning && emailVerificationTimer > 0) || isLoading}
              />
            </div>
            {emailExistsError && (
              <p className="text-xs text-red-500 mt-1">이미 가입된 이메일입니다.</p>
            )}
            {isEmailVerified && (
              <p className="text-xs text-green-500 mt-1">이메일 인증이 완료되었습니다.</p>
            )}
          </div>
          {/* 이메일 섹션 끝 */}

          {/* 이메일 인증번호 입력 UI */}
          {showEmailVerification && !isEmailVerified && (
            <div>
              <p className="text-lm font-bold text-black">이메일 인증번호</p>
              <div className="flex justify-between items-center border-b border-zinc-300">
                <input
                  type="text"
                  placeholder="인증번호 4자리 입력"
                  value={verificationCode}
                  onChange={handleVerificationCodeChange}
                  className="flex-1 text-zinc-700 placeholder-zinc-400 focus:outline-none py-1 bg-transparent"
                />
                {isTimerRunning && emailVerificationTimer > 0 && (
                  <p className="text-xs font-semibold text-red-600 mr-2">
                    {formatTime(emailVerificationTimer)}
                  </p>
                )}
                <ConfirmButton text="인증확인" onClick={handleVerifyCode} disabled={isLoading} />
              </div>
              {verificationCodeError && (
                <p className="text-xs text-red-500 mt-1">인증번호가 틀렸습니다.</p>
              )}
            </div>
          )}

          {/* 비밀번호 */}
          <div>
            <label className="text-lm font-bold text-black">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="8자리 이상, 영문/숫자/특수문자 조합"
                value={form.password}
                onChange={handleChange('password')}
                className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent pr-10"
              />
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

          {/* 비밀번호 확인 */}
          <div>
            <label className="text-lm font-bold text-black">비밀번호 확인</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호 확인"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent pr-10"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-0 top-2"
                aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showConfirmPassword ? (
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
            {passwordMismatch && (
              <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!isSignUpActive || isLoading}
            className={`w-[353px] h-[50px] rounded-xl font-semibold text-white transition-colors ${
              isSignUpActive && !isLoading
                ? 'bg-[#e6007e] hover:bg-[#d1006b]'
                : 'bg-zinc-300 cursor-not-allowed'
            }`}
          >
            {isLoading ? '처리중...' : '회원가입'}
          </button>
        </div>

        {/* 로그인 안내 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-[#666]">이미 계정이 있으신가요?</p>
          <p
            className="text-sm font-semibold text-primary cursor-pointer"
            onClick={() => (window.location.href = '/login')}
          >
            로그인
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
