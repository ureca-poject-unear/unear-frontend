import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import LoadingScreen from '@/components/common/LoadingScreen';
import UsageHistoryStats from '@/components/my/usagehistory/UsageHistoryStats';
import UsageHistoryList from '@/components/my/usagehistory/UsageHistoryList';
import UsageHistoryFilter from '@/components/my/usagehistory/UsageHistoryFilter';
import { useUsageHistory } from '@/hooks/my';
import type { UsageHistoryItem } from '@/types/usageHistory';

const dummyData: UsageHistoryItem[] = [
  {
    id: '1',
    storeName: '스타벅스 강남점',
    usedDate: '7월 9일 17:29',
    originalPrice: 16000,
    discountPrice: 2400,
    category: 'CAFE',
    storeClass: 'FRANCHISE',
  },
  {
    id: '2',
    storeName: '맥도날드 역삼점',
    usedDate: '7월 8일 15:45',
    originalPrice: 8500,
    discountPrice: 1200,
    category: 'FOOD',
    storeClass: 'FRANCHISE',
  },
  {
    id: '3',
    storeName: '올리브영 강남점',
    usedDate: '7월 8일 15:45',
    originalPrice: 25000,
    discountPrice: 3750,
    category: 'SHOPPING',
    storeClass: 'FRANCHISE',
  },
  {
    id: '4',
    storeName: 'GS25 테헤란점',
    usedDate: '7월 7일 20:10',
    originalPrice: 4500,
    discountPrice: 450,
    category: 'LIFE',
    storeClass: 'FRANCHISE',
  },
  {
    id: '5',
    storeName: '투레쥬르 강남점',
    usedDate: '7월 7일 20:10',
    originalPrice: 12000,
    discountPrice: 1800,
    category: 'BAKERY',
    storeClass: 'FRANCHISE',
  },
  {
    id: '6',
    storeName: 'CGV 강남점',
    usedDate: '7월 6일 19:30',
    originalPrice: 28000,
    discountPrice: 14000,
    category: 'CULTURE',
    storeClass: 'FRANCHISE',
  },
  {
    id: '7',
    storeName: 'CGV 강남점',
    usedDate: '7월 6일 19:30',
    originalPrice: 28000,
    discountPrice: 14000,
    category: 'CULTURE',
    storeClass: 'FRANCHISE',
  },
  {
    id: '8',
    storeName: 'CGV 강남점',
    usedDate: '7월 6일 19:30',
    originalPrice: 28000,
    discountPrice: 14000,
    category: 'CULTURE',
    storeClass: 'FRANCHISE',
  },
  {
    id: '9',
    storeName: 'CGV 강남점',
    usedDate: '7월 6일 19:30',
    originalPrice: 28000,
    discountPrice: 14000,
    category: 'CULTURE',
    storeClass: 'FRANCHISE',
  },
  {
    id: '10',
    storeName: 'CGV 강남점',
    usedDate: '7월 6일 19:30',
    originalPrice: 28000,
    discountPrice: 14000,
    category: 'CULTURE',
    storeClass: 'FRANCHISE',
  },
  {
    id: '11',
    storeName: 'CGV 강남점',
    usedDate: '7월 6일 19:30',
    originalPrice: 28000,
    discountPrice: 14000,
    category: 'CULTURE',
    storeClass: 'FRANCHISE',
  },
];

const UsageHistoryPage = () => {
  const navigate = useNavigate();
  const isLoading = false; // 실제로는 API 호출 상태

  const { displayedData, stats, hasMoreItems, handleFilterChange, handleLoadMore } =
    useUsageHistory({
      data: dummyData,
      initialPageSize: 8,
      pageSize: 8,
    });

  const handleBack = () => navigate(-1);

  if (isLoading) {
    return (
      <>
        <Header title="최근 이용 내역" onBack={handleBack} />
        <LoadingScreen message="이용 내역을 불러오는 중..." />
      </>
    );
  }

  return (
    <>
      <Header title="최근 이용 내역" onBack={handleBack} />

      <div className="bg-gray-50">
        {/* 통계 */}
        <UsageHistoryStats stats={stats} />

        {/* 필터 */}
        <UsageHistoryFilter onFilterChange={handleFilterChange} />

        {/* 이용 내역 리스트 */}
        <UsageHistoryList
          items={displayedData}
          hasMoreItems={hasMoreItems}
          onLoadMore={handleLoadMore}
        />
      </div>
    </>
  );
};

export default UsageHistoryPage;
