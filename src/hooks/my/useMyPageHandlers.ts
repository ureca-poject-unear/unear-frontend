import { useNavigate } from 'react-router-dom';
import type { MyPageHandlers } from '@/types/myPage';

const useMyPageHandlers = (): MyPageHandlers & { handleBack: () => void } => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const onLogout = () => {
    // 로그아웃 기능 구현
    console.log('로그아웃 실행');
    // TODO: 실제 로그아웃 로직 구현
    // - 토큰 삭제
    // - 로그인 페이지로 이동
    // navigate('/login');
  };

  const onCouponClick = () => {
    // 쿠폰 페이지로 이동
    navigate('/my/coupons');
  };

  const onBookmarkClick = () => {
    // 즐겨찾기 페이지로 이동
    navigate('/my/bookmarks');
  };

  const onStatisticsDetail = () => {
    navigate('/my/statistics');
  };

  const onUsageHistoryDetail = () => {
    navigate('/my/usage-history');
  };

  return {
    handleBack,
    onLogout,
    onCouponClick,
    onBookmarkClick,
    onStatisticsDetail,
    onUsageHistoryDetail,
  };
};

export default useMyPageHandlers;
