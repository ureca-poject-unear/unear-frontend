import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import UserProfileSection from '@/components/my/UserProfileSection';
import MembershipBenefitSection from '@/components/my/MembershipBenefitSection';
import StatisticsSection from '@/components/my/StatisticsSection';
import RecentUsageSection from '@/components/my/RecentUsageSection';

const MyPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    // 로그아웃 기능 구현
    console.log('로그아웃 실행');
    // 향후 로그인 페이지로 이동하는 로직 추가
  };

  const handleCouponClick = () => {
    // 쿠폰 페이지로 이동
    console.log('쿠폰 클릭');
  };

  const handleBookmarkClick = () => {
    // 즐겨찾기 페이지로 이동
    console.log('즐겨찾기 클릭');
  };

  const handleStatisticsDetail = () => {
    // 통계 자세히 보기 기능 구현
    console.log('통계 자세히 보기 클릭');
    // 향후 통계 상세 페이지로 이동하는 로직 추가
  };

  const handleUsageHistoryDetail = () => {
    // 최근 이용 내역 자세히 보기 기능 구현
    console.log('최근 이용 내역 자세히 보기 클릭');
    // 향후 이용 내역 상세 페이지로 이동하는 로직 추가
  };

  return (
    <>
      <Header title="마이 페이지" onBack={handleBack} />

      {/* 사용자 정보 영역 */}
      <UserProfileSection
        userName="유니어"
        userGrade="VVIP"
        greeting="오늘도 알뜰한 하루 되세요! ✨"
        onLogout={handleLogout}
      />

      {/* 멤버십 혜택 영역 */}
      <MembershipBenefitSection
        currentMonthSavings="21,200원"
        couponCount={5}
        onCouponClick={handleCouponClick}
        onBookmarkClick={handleBookmarkClick}
      />

      {/* 개인별 통계 영역 */}
      <StatisticsSection
        currentMonthSavings="21,200원"
        accumulatedSavings="21만원"
        onDetailClick={handleStatisticsDetail}
      />

      {/* 최근 이용 내역 영역 */}
      <RecentUsageSection onDetailClick={handleUsageHistoryDetail} />
    </>
  );
};

export default MyPage;
