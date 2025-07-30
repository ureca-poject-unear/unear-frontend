import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getUserUsageHistory,
  type UsageHistoryItem as ApiUsageHistoryItem,
} from '@/apis/getUserUsageHistory';
import type {
  UsageHistoryItem,
  UsageHistoryFilter,
  UsageHistoryStatsData,
} from '@/types/usageHistory';
import { calculateStats } from '@/utils/usageHistory';

interface UseApiUsageHistoryReturn {
  displayedData: UsageHistoryItem[];
  stats: UsageHistoryStatsData;
  hasMoreItems: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  handleFilterChange: (category: string, period: string) => void;
  handleLoadMore: () => Promise<void>;
  refreshData: () => Promise<void>;
}

/**
 * API 기반 이용 내역 데이터를 관리하는 훅
 */
const useApiUsageHistory = (): UseApiUsageHistoryReturn => {
  const [allData, setAllData] = useState<UsageHistoryItem[]>([]);
  const [currentDisplayCount, setCurrentDisplayCount] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<UsageHistoryFilter>({
    category: '전체',
    period: '전체',
  });

  const itemsPerPage = 8;

  /**
   * 날짜 포맷팅
   * @param dateStr "2025-07-29T00:00:00" 형태
   * @returns "7월 29일 00:00" 형태
   */
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  /**
   * 카테고리 매핑
   * @param apiCategory API에서 받은 카테고리
   * @returns 프론트엔드에서 사용하는 카테고리
   */
  const mapCategory = (apiCategory: string): UsageHistoryItem['category'] => {
    const categoryMap: Record<string, UsageHistoryItem['category']> = {
      SHOPPING: 'SHOPPING',
      ACTIVITY: 'ACTIVITY',
      LIFE: 'LIFE',
      FOOD: 'FOOD',
      CULTURE: 'CULTURE',
      BEAUTY: 'BEAUTY',
      CAFE: 'CAFE',
      EDUCATION: 'EDUCATION',
      BAKERY: 'BAKERY',
      POPUP: 'POPUP',
    };

    return categoryMap[apiCategory] || 'LIFE';
  };

  /**
   * API 데이터를 프론트엔드 형태로 변환
   */
  const transformApiData = useCallback((apiData: ApiUsageHistoryItem[]): UsageHistoryItem[] => {
    return apiData.map((item, index) => ({
      id: `usage-${index}-${item.usedAt}`, // 사용 시간 기반 고유 ID 생성
      storeName: item.placeName,
      usedDate: formatDate(item.usedAt),
      originalPrice: item.originalAmount,
      discountPrice: item.totalDiscountAmount,
      category: mapCategory(item.placeCategory),
      storeClass: 'FRANCHISE' as const, // API에 해당 정보가 없으므로 기본값
      rawDate: item.usedAt, // 원본 날짜 데이터 추가 (필터링용)
    }));
  }, []);

  /**
   * 카테고리 필터링
   */
  const filterByCategory = useCallback(
    (data: UsageHistoryItem[], category: string): UsageHistoryItem[] => {
      if (category === '전체') return data;

      // 새로운 카테고리 매핑 (필터 컴포넌트와 일치)
      const categoryMap: Record<string, string[]> = {
        카페: ['CAFE'],
        푸드: ['FOOD'],
        '생활/편의': ['LIFE'],
        쇼핑: ['SHOPPING'],
        문화: ['CULTURE'],
        베이커리: ['BAKERY'],
        액티비티: ['ACTIVITY'],
        교육: ['EDUCATION'],
        '뷰티/건강': ['BEAUTY'],
        팝업스토어: ['POPUP'],
      };

      const categories = categoryMap[category];
      return categories ? data.filter((item) => categories.includes(item.category)) : data;
    },
    []
  );

  /**
   * 기간 필터링
   */
  const filterByPeriod = useCallback(
    (data: UsageHistoryItem[], period: string): UsageHistoryItem[] => {
      if (period === '전체') return data;

      const now = new Date();
      let startDate: Date;

      switch (period) {
        case '1주일':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '1개월':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        case '3개월':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          break;
        case '1년':
          startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          break;
        default:
          return data;
      }

      return data.filter((item) => {
        const itemDate = new Date(item.rawDate || item.usedDate);
        return itemDate >= startDate && itemDate <= now;
      });
    },
    []
  );

  /**
   * 전체 데이터를 한 번에 로드하는 함수
   */
  const loadAllData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // 대용량 데이터를 위한 큰 페이지 사이즈 사용
      const largePageSize = 1000;
      let allItems: ApiUsageHistoryItem[] = [];
      let currentPage = 0;
      let hasMore = true;

      // 모든 페이지를 순차적으로 로드
      while (hasMore) {
        const response = await getUserUsageHistory(currentPage, largePageSize);

        if (response && response.content) {
          allItems = [...allItems, ...response.content];
          hasMore = !response.last;
          currentPage++;
        } else {
          hasMore = false;
        }

        // 너무 많은 요쳴을 방지하기 위한 안전 장치 (10페이지 제한)
        if (currentPage >= 10) {
          console.warn('데이터가 너무 많습니다. 최대 1만개만 로드합니다.');
          break;
        }
      }

      if (allItems.length > 0) {
        const transformedData = transformApiData(allItems);
        setAllData(transformedData);
        console.log(`✅ 전체 이용 내역 로드 완료: ${transformedData.length}건`);
      } else {
        setAllData([]);
        console.log('📊 이용 내역이 없습니다.');
      }
    } catch (err) {
      console.error('❌ 이용 내역 로드 실패:', err);
      setError('이용 내역 로드 중 오류가 발생했습니다.');
      setAllData([]);
    } finally {
      setIsLoading(false);
    }
  }, [transformApiData]);

  /**
   * 필터링된 데이터 계산 (실시간 필터링)
   */
  const filteredData = useMemo(() => {
    let filtered = allData;
    filtered = filterByCategory(filtered, filter.category);
    filtered = filterByPeriod(filtered, filter.period);
    return filtered;
  }, [allData, filter, filterByCategory, filterByPeriod]);

  /**
   * 현재 표시될 데이터와 더보기 가능 여부 계산
   */
  const { displayedData, hasMoreItems } = useMemo(() => {
    const displayed = filteredData.slice(0, currentDisplayCount);
    const hasMore = filteredData.length > currentDisplayCount;
    return { displayedData: displayed, hasMoreItems: hasMore };
  }, [filteredData, currentDisplayCount]);

  /**
   * 통계 계산 (필터링된 전체 데이터 기준)
   */
  const stats = useMemo(() => calculateStats(filteredData), [filteredData]);

  /**
   * 필터 변경 핸들러 (즉시 필터링 적용 + 페이지 리셋)
   */
  const handleFilterChange = useCallback(
    (category: string, period: string) => {
      console.log(`🔍 필터 변경: 카테고리=${category}, 기간=${period}`);
      setFilter({ category, period });
      setCurrentDisplayCount(itemsPerPage); // 필터 변경 시 페이지 리셋
    },
    [itemsPerPage]
  );

  /**
   * 더보기 핸들러 (현재 필터링 결과에서 더 보여주기)
   */
  const handleLoadMore = useCallback(async (): Promise<void> => {
    if (!hasMoreItems || isLoadingMore) return;

    setIsLoadingMore(true);

    setCurrentDisplayCount((prev) => prev + itemsPerPage);
    setIsLoadingMore(false);

    console.log(`📄 더보기: ${currentDisplayCount + itemsPerPage}건 표시`);
  }, [hasMoreItems, isLoadingMore, itemsPerPage, currentDisplayCount]);

  /**
   * 데이터 새로고침
   */
  const refreshData = useCallback(async (): Promise<void> => {
    console.log('🔄 데이터 새로고침 시작...');
    setAllData([]);
    setCurrentDisplayCount(itemsPerPage); // 페이지 리셋
    await loadAllData();
  }, [loadAllData, itemsPerPage]);

  // 컴포넌트 마운트 시 전체 데이터 로드
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return {
    displayedData,
    stats,
    hasMoreItems,
    isLoading,
    isLoadingMore,
    error,
    handleFilterChange,
    handleLoadMore,
    refreshData,
  };
};

export default useApiUsageHistory;
