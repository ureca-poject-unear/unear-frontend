import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const InitialPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAuthInitialized } = useAuthStore();

  useEffect(() => {
    if (!isAuthInitialized) {
      console.log('⏳ 인증 초기화 중');
      return;
    }

    const hasOnboarded = localStorage.getItem('hasOnboarded');
    console.log('hasOnboarded:', hasOnboarded);
    console.log('isAuthenticated:', isAuthenticated);

    if (!hasOnboarded) {
      console.log('➡️ 온보딩 이동');
      navigate('/onboarding');
    } else {
      if (isAuthenticated) {
        console.log('✅ 로그인 상태 → 메인 이동');
        navigate('/main');
      } else {
        console.log('❌ 로그인 안됨 → 로그인 이동');
        navigate('/login');
      }
    }
  }, [navigate, isAuthenticated, isAuthInitialized]);

  return null;
};

export default InitialPage;
