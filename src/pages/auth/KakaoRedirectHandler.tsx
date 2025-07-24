import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const KakaoRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKakaoLogin = async () => {
      // URL에서 'code' 파라미터(인가 코드)를 추출합니다.
      const code = searchParams.get('code');

      if (!code) {
        console.error('인가 코드가 없습니다.');
        setError('로그인에 실패했습니다. (인가 코드 없음)');
        // 에러 발생 시 잠시 후 로그인 페이지로 이동
        setTimeout(() => navigate('/login', { replace: true }), 3000);
        return;
      }

      console.log('카카오 인가 코드:', code);

      // 백엔드에 인가 코드를 보내 액세스 토큰을 요청할 URL
      // 이 URL은 백엔드에서 카카오 로그인을 처리하도록 구현한 API 엔드포인트여야 합니다.
      const apiUrl =
        import.meta.env.MODE === 'production'
          ? 'https://api.unear.site/api/app/auth/kakao/login' // 백엔드의 카카오 로그인 처리 API
          : 'http://dev.unear.site/api/app/auth/kakao/login'; // 백엔드의 카카오 로그인 처리 API

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }), // 백엔드로 인가 코드를 전송
        });

        const data = await response.json();

        if (response.ok && (data.codeName === 'SUCCESS' || data.resultCode === 200)) {
          console.log('백엔드 응답 데이터:', data);

          if (data.data?.accessToken) {
            // Zustand store에 액세스 토큰 저장
            setAccessToken(data.data.accessToken);
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
      } catch (err: any) {
        console.error('카카오 로그인 처리 중 오류 발생:', err);
        setError(err.message || '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        // 에러 발생 시 잠시 후 로그인 페이지로 이동
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      }
    };

    handleKakaoLogin();
  }, [navigate, searchParams, setAccessToken]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      {error ? (
        <>
          <div>카카오 로그인 처리 중 오류가 발생했습니다.</div>
          <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>
          <div style={{ marginTop: '20px' }}>잠시 후 로그인 페이지로 이동합니다.</div>
        </>
      ) : (
        <>
          <div>카카오 로그인 처리 중...</div>
          <div style={{ marginTop: '20px' }}>
            <div
              className="spinner"
              style={{
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3498db',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 2s linear infinite',
              }}
            ></div>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default KakaoRedirectHandler;
