import { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/auth';
import type { UserProfile, MembershipBenefit, StatisticsData, ChartDataItem } from '@/types/myPage';
import type { UsageHistoryItem } from '@/types/usageHistory';
import useCouponCount from './useCouponCount';

interface UseMyPageDataReturn {
  userProfile: UserProfile;
  membershipBenefit: MembershipBenefit;
  statisticsData: StatisticsData;
  recentUsageHistory: UsageHistoryItem[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const useMyPageData = (): UseMyPageDataReturn => {
  const [isLoading, setIsLoading] = useState(false); // true로 변경하면 로딩 테스트 가능
  const couponCount = useCouponCount();

  // Zustand store에서 사용자 정보 가져오기
  const { getUserDisplayName, getUserGrade } = useAuthStore();

  // 사용자 프로필 데이터 - Zustand store 사용
  const userProfile: UserProfile = useMemo(() => {
    const userGrade = getUserGrade();
    const mappedGrade = userGrade === 'BASIC' ? '우수' : (userGrade as 'VIP' | 'VVIP');

    return {
      name: getUserDisplayName(),
      grade: mappedGrade,
      greeting: '오늘도 알뜰한 하루 되세요! ✨',
    };
  }, [getUserDisplayName, getUserGrade]);

  // 멤버십 혜택 데이터
  const membershipBenefit: MembershipBenefit = useMemo(
    () => ({
      currentMonthSavings: '21,200원',
      couponCount,
    }),
    [couponCount]
  );

  // 통계 차트 데이터
  const chartData: ChartDataItem[] = useMemo(
    () => [
      { month: '3월', value: 0 },
      { month: '4월', value: 30 },
      { month: '5월', value: 28 },
      { month: '6월', value: 42 },
      { month: '7월', value: 21, highlight: true },
    ],
    []
  );

  // 통계 데이터
  const statisticsData: StatisticsData = useMemo(
    () => ({
      currentMonthSavings: '21,200원',
      accumulatedSavings: '21만원',
      chartData,
    }),
    [chartData]
  );

  // 최근 이용 내역 데이터
  const recentUsageHistory: UsageHistoryItem[] = useMemo(
    () => [
      {
        id: '1',
        storeName: '스타벅스 강남점',
        usedDate: '7월 3일 17:29',
        originalPrice: 16000,
        discountPrice: 2400,
        category: 'CAFE',
        storeClass: 'FRANCHISE',
      },
      {
        id: '2',
        storeName: '스타벅스 강남점',
        usedDate: '7월 3일 17:29',
        originalPrice: 16000,
        discountPrice: 2400,
        category: 'CAFE',
        storeClass: 'FRANCHISE',
      },
      {
        id: '3',
        storeName: '스타벅스 강남점',
        usedDate: '7월 3일 17:29',
        originalPrice: 16000,
        discountPrice: 2400,
        category: 'CAFE',
        storeClass: 'FRANCHISE',
      },
    ],
    []
  );

  // 데이터 새로고침 함수 (향후 API 연동 시 사용)
  const refreshData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // TODO: API 호출로 데이터 새로고침
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 임시 로딩
    } catch (error) {
      console.error('데이터 새로고침 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userProfile,
    membershipBenefit,
    statisticsData,
    recentUsageHistory,
    isLoading,
    refreshData,
  };
};

export default useMyPageData;
