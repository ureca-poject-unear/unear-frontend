import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
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

  // 액션 핸들러 (로그아웃 제외)
  const { handleBack, onCouponClick, onBookmarkClick, onStatisticsDetail, onUsageHistoryDetail } =
    useMyPageHandlers();

  return (
    <>
      <Header title="마이 페이지" onBack={handleBack} />

      {isLoading ? (
        <div className="bg-background">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm font-regular text-gray-600">
              마이페이지 데이터를 불러오는 중...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* 사용자 정보 영역 - 로그아웃은 컴포넌트 내부에서 처리 */}
          <UserProfileSection greeting={userProfile.greeting} />

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
