import BackIcon from '@/assets/common/backIcon.svg?react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { UsageHistoryItem } from '@/types/usageHistory';
import UsageHistoryItemComponent from './usagehistory/UsageHistoryItem';

interface RecentUsageSectionProps {
  usageHistory: UsageHistoryItem[];
  onDetailClick?: () => void;
  maxItems?: number;
  isLoading?: boolean;
  error?: string | null;
}

const RecentUsageSection = ({
  usageHistory,
  onDetailClick,
  maxItems = 3,
  isLoading = false,
  error = null,
}: RecentUsageSectionProps) => {
  const displayedItems = usageHistory.slice(0, maxItems);

  const handleDetailClick = () => {
    if (onDetailClick) {
      onDetailClick();
    } else {
      console.log('최근 이용 내역 자세히 보기 클릭');
    }
  };

  return (
    <div className="w-full bg-white mt-3">
      <div className="px-5 py-5">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-lm font-semibold text-black">최근 이용 내역</span>
          <button type="button" className="flex items-center" onClick={handleDetailClick}>
            <span className="text-m font-semibold text-black">자세히 보기</span>
            <BackIcon className="w-5 h-5 mb-0.5 text-black transform rotate-180" />
          </button>
        </div>

        <div className="-mx-5 px-5 space-y-1">
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="md" />
            </div>
          )}

          {/* 에러 상태 */}
          {error && !isLoading && (
            <div className="flex justify-center items-center py-8">
              <p className="text-sm text-gray-500">이용 내역을 불러올 수 없습니다.</p>
            </div>
          )}

          {/* 데이터 없음 상태 */}
          {!isLoading && !error && displayedItems.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <p className="text-sm text-gray-500">최근 이용 내역이 없습니다.</p>
            </div>
          )}

          {/* 이용 내역 리스트 */}
          {!isLoading &&
            !error &&
            displayedItems.length > 0 &&
            displayedItems.map((item) => (
              <UsageHistoryItemComponent
                key={item.id}
                storeName={item.storeName}
                usedDate={item.usedDate}
                originalPrice={item.originalPrice}
                discountPrice={item.discountPrice}
                category={item.category}
                storeClass={item.storeClass}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default RecentUsageSection;
