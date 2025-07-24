import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header'; // 실제 경로에 맞게 수정해주세요.
import ToggleButton from '../components/common/ToggleButton'; // 실제 경로에 맞게 수정해주세요.

// --- 1. 타입 정의 (변경 없음) ---
interface UserInfo {
  email: string;
}

interface ProfileForm {
  name: string;
  password: string;
  confirmPassword: string;
  gender: '남자' | '여자';
  birth: string;
  phone: string;
}

interface MeApiResponse {
  resultCode: number;
  message: string;
  data: {
    email: string;
    username: string;
    isProfileComplete: boolean;
  };
}

const CompleteProfilePage: React.FC = () => {
  // --- 2. 상태(State) 정의 (변경 없음) ---
  const [user, setUser] = useState<UserInfo>({ email: '' });
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    password: '',
    confirmPassword: '',
    gender: '남자',
    birth: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- 3. 데이터 로딩 및 검증 (변경 없음) ---
  useEffect(() => {
    const fetchAndVerifyUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        alert('잘못된 접근입니다. 다시 로그인해주세요.');
        window.location.href = '/login';
        return;
      }
      try {
        const response = await fetch('https://dev.unear.site/api/app/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) throw new Error('사용자 정보 조회 실패');
        const result = (await response.json()) as MeApiResponse;
        if (result.data.isProfileComplete) {
          alert('이미 모든 정보를 입력하셨습니다. 홈으로 이동합니다.');
          window.location.href = '/';
          return;
        }
        setUser({ email: result.data.email });
        setForm((prev) => ({ ...prev, name: result.data.username }));
      } catch (error) {
        console.error('API Error:', error);
        alert('오류가 발생했습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      }
    };
    fetchAndVerifyUser();
  }, []);

  // --- 4. 핸들러 함수 (변경 없음) ---
  const handleChange = (field: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prev) => {
      const newForm = { ...prev, [field]: value };
      if (newForm.password && newForm.confirmPassword) {
        setPasswordMismatch(newForm.password !== newForm.confirmPassword);
      } else {
        setPasswordMismatch(false);
      }
      return newForm;
    });
  };

  const formatBirthdate = (birthString: string): string => {
    if (birthString.length === 8) {
      const year = birthString.substring(0, 4);
      const month = birthString.substring(4, 6);
      const day = birthString.substring(6, 8);
      return `${year}-${month}-${day}T00:00:00`;
    }
    return birthString;
  };

  const handleSubmit = async () => {
    if (passwordMismatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (form.birth.length !== 8) {
      alert('생년월일을 8자리로 입력해주세요.');
      return;
    }
    if (form.name.trim() === '') {
      alert('이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch('https://dev.unear.site/api/app/auth/oauth/complete-profile', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username: form.name,
          tel: form.phone,
          birthdate: formatBirthdate(form.birth),
          gender: form.gender === '남자' ? 'M' : 'F',
        }),
      });
      if (response.ok) {
        alert('추가 정보 입력이 완료되었습니다! 서비스를 시작합니다.');
        window.location.href = '/';
      } else {
        const errorResult = await response.json();
        alert(errorResult.message || '정보 업데이트에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    form.name.trim() !== '' &&
    form.birth.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.password.trim() !== '' &&
    form.confirmPassword.trim() !== '' &&
    !passwordMismatch;

  // --- 5. JSX 렌더링 (수정된 부분) ---
  return (
    // 최상위 Fragment를 div로 변경하고 배경색 및 전체 화면 클래스 추가
    <div className="bg-white min-h-screen">
      <Header title="추가 정보 입력" />
      <div className="mt-[25px]">
        <div className="px-5 flex flex-col gap-6">
          {/* 이름 (수정 가능) */}
          <div>
            <label className="text-lm font-bold text-black">이름</label>
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              value={form.name}
              onChange={handleChange('name')}
              className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* 이메일 (수정 불가) */}
          <div>
            <label className="text-lm font-bold text-black">이메일</label>
            <div className="w-full h-10 pt-2 border-b border-zinc-300 text-zinc-500 bg-zinc-100 rounded px-2">
              {user.email}
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="text-lm font-bold text-black">비밀번호 설정</label>
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
                onClick={() => setShowPassword((prev) => !prev)}
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
                      d="M3.98 8.223A10.477 10.477 0 001.458 12c1.274 4.057 5.065 6.75 9.542 6.75 1.493 0 2.91-.348 4.208-.97M8.25 15a3.75 3.75 0 005.25-5.25M12 5.25c1.493 0 2.91.348 4.208-.97A10.477 10.477 0 0122.542 12a10.45 10.45 0 01-1.852 3.045M3 3l18 18"
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
                placeholder="비밀번호를 다시 입력해주세요"
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
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

          {/* 성별 */}
          <div>
            <label className="text-lm font-bold text-black">성별</label>
            <div className="flex gap-4 mt-2">
              {(['남자', '여자'] as const).map((g) => (
                <ToggleButton
                  key={g}
                  text={g}
                  isActive={form.gender === g}
                  onClick={() => setForm({ ...form, gender: g })}
                />
              ))}
            </div>
          </div>

          {/* 생년월일 */}
          <div>
            <label className="text-lm font-bold text-black">생년월일</label>
            <input
              type="text"
              placeholder="8자리로 입력 (예: 19940508)"
              value={form.birth}
              onChange={handleChange('birth')}
              maxLength={8}
              className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="text-lm font-bold text-black">전화번호</label>
            <input
              type="tel"
              placeholder="'-' 없이 숫자만 입력"
              value={form.phone}
              onChange={handleChange('phone')}
              className="w-full border-b border-zinc-300 text-zinc-700 mt-1 placeholder-zinc-400 focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* 완료 버튼 */}
        <div className="mt-8 mb-8 flex justify-center px-5">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className={`w-full h-[50px] rounded-xl font-semibold text-white transition-colors ${
              isFormValid && !isLoading
                ? 'bg-[#e6007e] hover:bg-[#d1006b]'
                : 'bg-zinc-300 cursor-not-allowed'
            }`}
          >
            {isLoading ? '처리 중...' : '입력 완료'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
