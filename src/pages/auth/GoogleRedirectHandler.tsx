// src/pages/auth/GoogleRedirectHandler.tsx

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// /me API 응답 타입 (이미 다른 곳에 있다면 가져와서 사용하세요)
interface MeApiResponse {
  data: {
    isProfileComplete: boolean;
    // ... 기타 사용자 정보
  };
}

const GoogleRedirectHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. URL에서 백엔드가 보내준 토큰을 추출합니다.
    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      // 토큰이 없으면 로그인 실패로 간주하고 로그인 페이지로 보냅니다.
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
      navigate('/login', { replace: true });
      return;
    }

    // 2. 받아온 토큰을 localStorage에 저장합니다.
    localStorage.setItem('accessToken', accessToken);

    // 3. 저장된 토큰으로 /me API를 호출하여 프로필 완성 여부를 확인합니다.
    const checkProfileStatus = async () => {
      try {
        const response = await fetch('https://dev.unear.site/api/app/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('사용자 정보 조회 실패');
        }

        const result = await response.json();
        console.log('✅ /me API 응답:', result);

        // 4. ✨ 여기가 핵심: 프로필 완성 여부에 따라 분기 처리합니다.
        if (!result?.data) {
          throw new Error('사용자 데이터가 존재하지 않습니다.');
        }

        if (result.data.isProfileComplete) {
          navigate('/', { replace: true });
        } else {
          alert('서비스 이용을 위해 추가 정보 입력이 필요합니다.');
          navigate('/complete-profile', { replace: true });
        }
      } catch (error) {
        console.error('프로필 확인 오류:', error);
        alert('사용자 정보를 확인하는 중 오류가 발생했습니다.');
        navigate('/login', { replace: true });
      }
    };

    checkProfileStatus();
  }, []); // 이 useEffect는 페이지가 처음 로드될 때 딱 한 번만 실행되어야 합니다.

  // API를 호출하고 처리하는 동안 사용자에게 보여줄 로딩 화면
  return (
    <div>
      <h1>로그인 처리 중입니다. 잠시만 기다려주세요...</h1>
    </div>
  );
};

export default GoogleRedirectHandler;
