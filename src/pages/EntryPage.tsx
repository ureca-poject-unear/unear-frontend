import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

const EntryPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // 로딩 중에는 리다이렉트 대기

    const hasOnboarded = localStorage.getItem('hasOnboarded') === 'true';

    if (isAuthenticated) {
      // 인증됐으면 메인 페이지로 이동
      navigate('/main', { replace: true });
    } else if (!hasOnboarded) {
      // 온보딩 안 했으면 온보딩으로
      navigate('/onboarding', { replace: true });
    } else {
      // 인증 안 됐고 온보딩 했으면 로그인 페이지로
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return null;
};

export default EntryPage;
