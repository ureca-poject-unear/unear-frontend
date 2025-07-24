import type { UsageHistoryItem as UsageHistoryItemType } from '@/types/usageHistory';
import UsageHistoryItem from './UsageHistoryItem';

interface UsageHistoryListProps {
  items: UsageHistoryItemType[];
  hasMoreItems: boolean;
  onLoadMore: () => void;
  emptyMessage?: string;
}

const UsageHistoryList = ({
  items,
  hasMoreItems,
  onLoadMore,
  emptyMessage = '해당 조건에 맞는 이용 내역이 없습니다.',
}: UsageHistoryListProps) => {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-black bg-white">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white space-y-2 px-4 pt-3 pb-3">
      {items.map((item) => (
        <UsageHistoryItem
          key={item.id}
          storeName={item.storeName}
          usedDate={item.usedDate}
          originalPrice={item.originalPrice}
          discountPrice={item.discountPrice}
          category={item.category}
          storeClass={item.storeClass}
        />
      ))}

      {hasMoreItems && (
        <div className="pt-1">
          <button
            onClick={onLoadMore}
            className="w-full pt-2.5 pb-2 text-sm text-center text-black font-semibold bg-white border rounded-lg hover:bg-gray-100 transition-colors"
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
};

export default UsageHistoryList;
