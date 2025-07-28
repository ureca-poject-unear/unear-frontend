import { useNavigate } from 'react-router-dom';
import type { MyPageHandlers } from '@/types/myPage';

const useMyPageHandlers = (): Omit<MyPageHandlers, 'onLogout'> & { 
  handleBack: () => void;
  onChangePassword: () => void;
  onDeleteAccount: () => void;
} => {
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

  const onChangePassword = () => {
    // 비밀번호 변경 페이지로 이동
    navigate('/my/change-password');
  };

  const onDeleteAccount = () => {
    // TODO: 회원탈퇴 확인 모달 표시
    const confirmDelete = window.confirm('정말로 회원탈퇴를 하시겠습니까?');
    if (confirmDelete) {
      console.log('회원탈퇴 처리');
      // 회원탈퇴 API 호출
    }
  };

  return {
    handleBack,
    onCouponClick,
    onBookmarkClick,
    onStatisticsDetail,
    onUsageHistoryDetail,
    onChangePassword,
    onDeleteAccount,
  };
};

export default useMyPageHandlers;
