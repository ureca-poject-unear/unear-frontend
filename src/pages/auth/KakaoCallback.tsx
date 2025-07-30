// src/pages/auth/KakaoCallback.tsx (새 파일)
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth'; // Zustand 스토어를 그대로 사용

const KakaoCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    // 1. URL에서 백엔드가 보내준 토큰을 추출 (구글과 동일)
    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
      navigate('/login', { replace: true });
      return;
    }

    // 2. 받아온 토큰을 Zustand store에 저장
    setAccessToken(accessToken);
    console.log('✅ 카카오 로그인 성공, 토큰 저장 완료');

    // (선택) 구글처럼 /me API를 호출해서 프로필 완성 여부를 확인하는 로직 추가
    const checkProfileStatus = async () => {
      try {
        const response = await fetch('https://dev.unear.site/api/app/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error('사용자 정보 조회 실패');

        const result = await response.json();

        if (result.data.isProfileComplete) {
          navigate('/', { replace: true });
        } else {
          alert('서비스 이용을 위해 추가 정보 입력이 필요합니다.');
          navigate('/complete-profile', { replace: true });
        }
      } catch (error) {
        console.error('프로필 확인 오류:', error);
        alert('로그인에 성공했으나 사용자 정보를 확인하는 중 오류가 발생했습니다.');
        // 일단 메인으로 보내거나, 에러 페이지로 보낼 수 있습니다.
        navigate('/', { replace: true });
      }
    };

    checkProfileStatus();
  }, [navigate, searchParams, setAccessToken]);

  return (
    <div>
      <h1>카카오 로그인 처리 중입니다. 잠시만 기다려주세요...</h1>
    </div>
  );
};

export default KakaoCallback;
