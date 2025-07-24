import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Next.js 사용 시
// import { useNavigate } from 'react-router-dom'; // Create React App 사용 시

// 백엔드의 /me API 응답 타입 (CompleteProfilePage에서 정의한 것을 재사용하거나 가져오세요)
interface MeApiResponse {
  data: {
    email: string;
    username: string;
    isProfileComplete: boolean; // 이 값이 가장 중요합니다!
  };
}

const HomePage: React.FC = () => {
  const router = useRouter(); // Next.js
  // const navigate = useNavigate(); // CRA

  const [isLoading, setIsLoading] = useState(true); // 확인하는 동안 로딩 상태 표시

  useEffect(() => {
    // 1. URL에 토큰이 있는지 확인하고 localStorage에 저장하는 로직
    // 백엔드가 토큰을 URL에 담아 보내주는 경우에만 필요합니다.
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('accessToken', tokenFromUrl);
      // 토큰을 URL에서 제거하여 주소를 깔끔하게 만듭니다.
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. localStorage에 저장된 토큰으로 프로필 상태를 확인합니다.
    const checkProfileStatus = async () => {
      const accessToken = localStorage.getItem('accessToken');

      // 토큰이 없으면 로그인 상태가 아니므로 아무것도 안 하거나 로그인 페이지로 보냅니다.
      if (!accessToken) {
        setIsLoading(false);
        // router.push('/login'); // 필요시
        return;
      }

      try {
        const response = await fetch('http://dev.unear.site/api/app/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const result = (await response.json()) as MeApiResponse;

          // 3. ✨ 여기가 핵심! 프로필이 완성되지 않았다면 추가 정보 입력 페이지로 보냅니다.
          if (!result.data.isProfileComplete) {
            alert('서비스 이용을 위해 추가 정보 입력이 필요합니다.');
            router.push('/complete-profile'); // 추가 정보 입력 페이지로 강제 이동
            // navigate('/complete-profile'); // CRA
          } else {
            // 이미 정보 입력이 완료된 사용자는 로딩을 끝내고 홈페이지를 보여줍니다.
            setIsLoading(false);
          }
        } else {
          // 토큰이 유효하지 않은 경우 등
          localStorage.removeItem('accessToken');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('프로필 상태 확인 중 오류:', error);
        setIsLoading(false);
      }
    };

    checkProfileStatus();
  }, [router]); // CRA의 경우 [navigate]

  // 프로필 상태를 확인하는 동안 사용자에게 로딩 화면을 보여줍니다.
  if (isLoading) {
    return <div>사용자 정보를 확인 중입니다...</div>;
  }

  // 모든 검사를 통과한 사용자에게 보여줄 실제 홈페이지 내용
  return (
    <div>
      <h1>Unear 서비스에 오신 것을 환영합니다!</h1>
      <p>정상적으로 로그인 되었으며, 모든 정보가 입력되었습니다.</p>
    </div>
  );
};

export default HomePage;
