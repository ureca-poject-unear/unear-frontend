import BackIcon from '@/assets/common/backIcon.svg?react';
import type { UsageHistoryItem } from '@/types/usageHistory';
import UsageHistoryItemComponent from './usagehistory/UsageHistoryItem';

interface RecentUsageSectionProps {
  usageHistory: UsageHistoryItem[];
  onDetailClick?: () => void;
  maxItems?: number;
}

const RecentUsageSection = ({
  usageHistory,
  onDetailClick,
  maxItems = 3,
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
      <div className="px-5 py-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-lm font-semibold text-black">최근 이용 내역</span>
          <button type="button" className="flex items-center" onClick={handleDetailClick}>
            <span className="text-m font-semibold text-black">자세히 보기</span>
            <BackIcon className="w-5 h-5 mb-0.5 text-black transform rotate-180" />
          </button>
        </div>

        <div className="-mx-5 px-5 space-y-1">
          {displayedItems.map((item) => (
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
