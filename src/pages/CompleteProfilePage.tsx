import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import ToggleButton from '../components/common/ToggleButton';
import { authApi } from '../apis/auth';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import axiosInstance from '../apis/axiosInstance';
import { useAuthStore } from '../store/auth';
import { useAuth } from '../providers/AuthProvider';

// --- 1. 타입 정의 (변경 없음) ---
interface UserInfo {
  email: string;
}

interface ProfileForm {
  name: string;
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
  const navigate = useNavigate();
  const { getStoredAccessToken } = useAuthStore();
  const { refreshUserInfo } = useAuth();
  // --- 2. 상태(State) 정의 (변경 없음) ---
  const [user, setUser] = useState<UserInfo>({ email: '' });
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    gender: '남자',
    birth: '',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // 초기 로딩 상태

  // 데이터 로딩 및 검증 (OAuth에서 온 경우 단순화)
  useEffect(() => {
    const fetchAndVerifyUser = async () => {
      const accessToken = getStoredAccessToken();
      if (!accessToken) {
        showErrorToast('잘못된 접근입니다. 다시 로그인해주세요.');
        navigate('/login', { replace: true });
        return;
      }

      // OAuth 리다이렉트에서 온 경우 중복 확인 방지 (깜빡임 방지용)
      const oauthInProgress = sessionStorage.getItem('oauth_redirect_in_progress');

      if (oauthInProgress) {
        console.log('🔄 OAuth 리다이렉트에서 온 사용자 - 기본 정보만 로드');
        // 플래그 제거 (일회성)
        sessionStorage.removeItem('oauth_redirect_in_progress');

        try {
          // OAuth에서 이미 프로필 상태를 확인했으므로 기본 사용자 정보만 로드
          const response = await axiosInstance.get('/users/me');
          const result = response.data as MeApiResponse;
          setUser({ email: result.data.email });
          setForm((prev) => ({ ...prev, name: result.data.username }));
          setIsInitializing(false);
          return;
        } catch (error) {
          console.error('API Error:', error);
          showErrorToast('오류가 발생했습니다. 다시 로그인해주세요.');
          navigate('/login', { replace: true });
          return;
        }
      }

      // 일반적인 접근 (직접 URL 입력 등)시에만 프로필 완료 상태 확인
      try {
        const response = await axiosInstance.get('/users/me');
        const result = response.data as MeApiResponse;

        if (result.data.isProfileComplete) {
          console.log('✅ 이미 프로필 완성됨 - 메인으로 리다이렉트');
          navigate('/', { replace: true });
          return;
        }

        setUser({ email: result.data.email });
        setForm((prev) => ({ ...prev, name: result.data.username }));
        setIsInitializing(false);
      } catch (error) {
        console.error('API Error:', error);
        showErrorToast('오류가 발생했습니다. 다시 로그인해주세요.');
        navigate('/login', { replace: true });
      }
    };

    fetchAndVerifyUser();
  }, [navigate, getStoredAccessToken]);

  // 초기 로딩 중이면 로딩 화면 표시
  if (isInitializing) {
    return (
      <div className="bg-white min-h-screen">
        <Header title="추가 정보 입력" />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm font-regular text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // --- 4. 핸들러 함수 (변경 없음) ---
  const handleChange = (field: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setForm((prev) => {
      const newForm = { ...prev, [field]: value };
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
    if (form.birth.length !== 8) {
      showErrorToast('생년월일을 8자리로 입력해주세요.');
      return;
    }
    if (form.name.trim() === '') {
      showErrorToast('이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. 프로필 업데이트
      await authApi.completeOAuthProfile({
        username: form.name,
        tel: form.phone,
        birthdate: formatBirthdate(form.birth),
        gender: form.gender === '남자' ? 'M' : 'F',
      });

      console.log('✅ 프로필 업데이트 API 성공');

      // 2. DB 업데이트 시간 확보 및 재시도 로직
      let retryCount = 0;
      const maxRetries = 5;
      let isUpdated = false;

      while (retryCount < maxRetries && !isUpdated) {
        await new Promise((resolve) => setTimeout(resolve, 1000 + retryCount * 500));

        try {
          const verifyResponse = await axiosInstance.get('/users/me');
          const userData = verifyResponse.data.data;

          console.log(`🔍 업데이트 확인 시도 ${retryCount + 1}/${maxRetries}:`, {
            isProfileComplete: userData.isProfileComplete,
            username: userData.username,
          });

          if (userData.isProfileComplete) {
            isUpdated = true;
            console.log('✅ 프로필 완성 상태 확인됨');

            // 3. AuthProvider의 사용자 정보 강제 새로고침
            await refreshUserInfo();

            // 4. 추가 대기 시간 (AuthProvider 상태 업데이트 대기)
            await new Promise((resolve) => setTimeout(resolve, 500));

            showSuccessToast('추가 정보 입력이 완료되었습니다!');

            // 프로필 완료 후 메인으로 이동
            navigate('/', { replace: true });
            return;
          }
        } catch (verifyError) {
          console.warn(`⚠️ 업데이트 확인 중 오류 (시도 ${retryCount + 1}):`, verifyError);
        }

        retryCount++;
      }

      // 모든 재시도가 실패한 경우
      if (!isUpdated) {
        console.error('❌ 프로필 업데이트 확인 실패 - 모든 재시도 완료');
        showErrorToast(
          '프로필 업데이트는 완료되었지만 확인에 시간이 걸리고 있습니다. 잠시 후 다시 시도해주세요.'
        );
      }
    } catch (error: unknown) {
      console.error('Submit Error:', error);
      const apiError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      const errorMessage =
        apiError.response?.data?.message || '정보 업데이트에 실패했습니다. 다시 시도해주세요.';
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    form.name.trim() !== '' && form.birth.trim() !== '' && form.phone.trim() !== '';

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
