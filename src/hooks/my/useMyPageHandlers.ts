import { useNavigate } from 'react-router-dom';
import type { MyPageHandlers } from '@/types/myPage';

const useMyPageHandlers = (): Omit<MyPageHandlers, 'onLogout'> & { handleBack: () => void } => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
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
    onCouponClick,
    onBookmarkClick,
    onStatisticsDetail,
    onUsageHistoryDetail,
  };
};

export default useMyPageHandlers;
