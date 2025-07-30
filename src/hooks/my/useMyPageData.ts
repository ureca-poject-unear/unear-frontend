import { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/auth';
import type { UserProfile, MembershipBenefit, StatisticsData } from '@/types/myPage';
import type { UsageHistoryItem } from '@/types/usageHistory';
import useCouponCount from './useCouponCount';
import useStatisticsSummary from './useStatisticsSummary';

interface UseMyPageDataReturn {
  userProfile: UserProfile;
  membershipBenefit: MembershipBenefit;
  statisticsData: StatisticsData;
  recentUsageHistory: UsageHistoryItem[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  userProvider: string | null; // provider 정보 추가
  statisticsLoading: boolean; // 통계 로딩 상태 추가
  statisticsError: string | null; // 통계 에러 상태 추가
}

const useMyPageData = (): UseMyPageDataReturn => {
  const [isLoading, setIsLoading] = useState(false); // true로 변경하면 로딩 테스트 가능
  const couponCount = useCouponCount();

  // 통계 데이터 훅 사용
  const {
    statisticsData,
    isLoading: statisticsLoading,
    error: statisticsError,
    refreshData: refreshStatistics,
  } = useStatisticsSummary();

  // Zustand store에서 사용자 정보 가져오기
  const { getUserDisplayName, getUserGrade, getUserProvider } = useAuthStore();

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

  // 멤버십 혜택 데이터 - 실제 API 데이터 사용
  const membershipBenefit: MembershipBenefit = useMemo(
    () => ({
      currentMonthSavings: statisticsData.accumulatedSavings, // API에서 가져온 이번달 할인액
      couponCount,
    }),
    [statisticsData.accumulatedSavings, couponCount]
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

  // 데이터 새로고침 함수
  const refreshData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // 통계 데이터 새로고침
      await refreshStatistics();
      // TODO: 다른 API 호출로 데이터 새로고침
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
    userProvider: getUserProvider(), // provider 정보 추가
    statisticsLoading,
    statisticsError,
  };
};

export default useMyPageData;
