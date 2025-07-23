import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import LoadingScreen from '@/components/common/LoadingScreen';
import { UsageHistoryItem } from '@/components/my';
import UsageHistoryFilter from '@/components/my/usagehistory/UsageHistoryFilter';
import type { UsageHistoryItem as UsageHistoryItemType, CategoryType } from '@/types/myPage';

const dummyData: UsageHistoryItemType[] = [
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

const getCategoryDisplayName = (category: CategoryType) => {
  switch (category) {
    case 'CAFE':
      return '카페';
    case 'FOOD':
      return '푸드';
    case 'LIFE':
      return '편의점';
    case 'SHOPPING':
      return '쇼핑';
    case 'CULTURE':
      return '엔터테인먼트';
    case 'BAKERY':
      return '베이커리';
    case 'ACTIVITY':
      return '액티비티';
    case 'EDUCATION':
      return '교육';
    case 'BEAUTY':
      return '뷰티/건강';
    case 'POPUP':
      return '팝업스토어';
    default:
      return '기타';
  }
};

const UsageHistoryPage = () => {
  const navigate = useNavigate();
  const [visibleItemsCount, setVisibleItemsCount] = useState(8);
  const [categoryFilter, setCategoryFilter] = useState('전체');
  const [periodFilter, setPeriodFilter] = useState('전체');

  const isLoading = false;

  // 필터링된 데이터
  const filteredData = useMemo(
    () =>
      dummyData.filter((item) => {
        const categoryMatch =
          categoryFilter === '전체' || getCategoryDisplayName(item.category) === categoryFilter;
        // 기간 필터는 여기선 전체만 처리
        const periodMatch = periodFilter === '전체';
        return categoryMatch && periodMatch;
      }),
    [categoryFilter, periodFilter]
  );

  // 표시할 데이터 (페이지네이션)
  const displayedData = filteredData.slice(0, visibleItemsCount);

  // 통계 계산
  const totalSavings = filteredData.reduce((sum, item) => sum + item.discountPrice, 0);
  const totalTransactions = filteredData.length;

  const handleFilterChange = (category: string, period: string) => {
    setCategoryFilter(category);
    setPeriodFilter(period);
    setVisibleItemsCount(8); // 필터 변경 시 페이지네이션 리셋
  };

  const handleLoadMore = () => setVisibleItemsCount((prev) => prev + 8);
  const hasMoreItems = visibleItemsCount < filteredData.length;

  const handleBack = () => navigate(-1);

  return (
    <>
      <Header title="최근 이용 내역" onBack={handleBack} />

      {isLoading ? (
        <LoadingScreen message="이용 내역을 불러오는 중..." />
      ) : (
        <div className="bg-gray-50">
          {/* 상단 통계 */}
          <div className="bg-white px-5 pt-4">
            <div className="flex justify-between items-start">
              <div className="text-lg font-semibold text-black">
                {totalSavings.toLocaleString('ko-KR')}원
              </div>
              <div className="text-lg font-semibold text-black">{totalTransactions}건</div>
            </div>
            <div className="flex justify-between items-center text-m text-gray-500 font-semibold">
              <span>총 절약 금액</span>
              <span>거래 건수</span>
            </div>
          </div>

          {/* 필터 */}
          <UsageHistoryFilter onFilterChange={handleFilterChange} />

          {/* 이용 내역 리스트 */}
          <div className="bg-white space-y-2 px-4 pt-3 pb-3">
            {displayedData.length > 0 ? (
              <>
                {displayedData.map(({ id, ...props }) => (
                  <UsageHistoryItem key={id} {...props} />
                ))}
                {hasMoreItems && (
                  <div className="pt-1">
                    <button
                      onClick={handleLoadMore}
                      className="w-full pt-2.5 pb-2 text-sm text-center text-black font-semibold bg-white border rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      더보기
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>해당 조건에 맞는 이용 내역이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UsageHistoryPage;
