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
    console.log('쿠폰 클릭');
    // TODO: 쿠폰 페이지 라우팅
    // navigate('/coupons');
  };

  const onBookmarkClick = () => {
    // 즐겨찾기 페이지로 이동
    console.log('즐겨찾기 클릭');
    // TODO: 즐겨찾기 페이지 라우팅
    // navigate('/bookmarks');
  };

  const onStatisticsDetail = () => {
    // 통계 자세히 보기 기능 구현
    console.log('통계 자세히 보기 클릭');
    // TODO: 통계 상세 페이지 라우팅
    // navigate('/statistics');
  };

  const onUsageHistoryDetail = () => {
    // 최근 이용 내역 자세히 보기 기능 구현
    console.log('최근 이용 내역 자세히 보기 클릭');
    // TODO: 이용 내역 상세 페이지 라우팅
    // navigate('/usage-history');
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
