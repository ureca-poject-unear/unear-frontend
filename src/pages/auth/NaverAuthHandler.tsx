import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const NaverAuthHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      console.error('Missing code or state in Naver callback');
      navigate('/login'); // 또는 오류 페이지
      return;
    }

    // 백엔드에 Naver code 전달하여 토큰 받아오기
    const sendCodeToServer = async () => {
      try {
        const response = await fetch('http://dev.unear.site/api/auth/naver', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          throw new Error('Naver login failed');
        }

        const result = await response.json();
        console.log('Login success:', result);

        navigate('/home');
      } catch (error) {
        console.error('Naver login error:', error);
        navigate('/login');
      }
    };

    sendCodeToServer();
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600 text-lg">네이버 로그인 처리 중입니다...</p>
    </div>
  );
};

export default NaverAuthHandler;
