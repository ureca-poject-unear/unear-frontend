import Header from '@/components/common/Header';
import LoadingScreen from '@/components/common/LoadingScreen';
import UserProfileSection from '@/components/my/UserProfileSection';
import MembershipBenefitSection from '@/components/my/MembershipBenefitSection';
import StatisticsSection from '@/components/my/StatisticsSection';
import RecentUsageSection from '@/components/my/RecentUsageSection';
import useMyPageData from '@/hooks/my/useMyPageData';
import useMyPageHandlers from '@/hooks/my/useMyPageHandlers';

const MyPage = () => {
  // 데이터 관리
  const { userProfile, membershipBenefit, statisticsData, recentUsageHistory, isLoading } =
    useMyPageData();

  // 액션 핸들러
  const {
    handleBack,
    onLogout,
    onCouponClick,
    onBookmarkClick,
    onStatisticsDetail,
    onUsageHistoryDetail,
  } = useMyPageHandlers();

  return (
    <>
      <Header title="마이 페이지" onBack={handleBack} />

      {isLoading ? (
        <LoadingScreen message="마이페이지 데이터를 불러오는 중..." />
      ) : (
        <>
          {/* 사용자 정보 영역 */}
          <UserProfileSection
            name={userProfile.name}
            grade={userProfile.grade}
            greeting={userProfile.greeting}
            onLogout={onLogout}
          />

          {/* 멤버십 혜택 영역 */}
          <MembershipBenefitSection
            currentMonthSavings={membershipBenefit.currentMonthSavings}
            couponCount={membershipBenefit.couponCount}
            onCouponClick={onCouponClick}
            onBookmarkClick={onBookmarkClick}
          />

          {/* 개인별 통계 영역 */}
          <StatisticsSection
            currentMonthSavings={statisticsData.currentMonthSavings}
            accumulatedSavings={statisticsData.accumulatedSavings}
            chartData={statisticsData.chartData}
            onDetailClick={onStatisticsDetail}
          />

          {/* 최근 이용 내역 영역 */}
          <RecentUsageSection
            usageHistory={recentUsageHistory}
            onDetailClick={onUsageHistoryDetail}
          />
        </>
      )}
    </>
  );
};

export default MyPage;
