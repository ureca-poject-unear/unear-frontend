import StoreTypeIcon from '@/components/common/StoreTypeIcon';

interface UsageHistoryItemProps {
  storeName: string;
  usedDate: string;
  originalPrice: number;
  discountPrice: number;
  category?:
    | 'cafe'
    | 'food'
    | 'shopping'
    | 'education'
    | 'culture'
    | 'bakery'
    | 'beauty'
    | 'convenience'
    | 'activity'
    | 'popup';
  storeClass?: 'franchise' | 'small-business' | 'event';
}

const UsageHistoryItem = ({
  storeName,
  usedDate,
  originalPrice,
  discountPrice,
  category = 'cafe',
  storeClass = 'franchise',
}: UsageHistoryItemProps) => {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()}원`;
  };

  return (
    <div
      className="h-[64px] flex items-center justify-between px-2 bg-white rounded-lg"
      style={{ boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)' }}
    >
      {/* 왼쪽: 아이콘 */}
      <div className="flex-shrink-0">
        <StoreTypeIcon category={category} storeClass={storeClass} mode="statistics" />
      </div>

      {/* 중간: 매장 정보 */}
      <div className="flex-1 ml-3 flex flex-col justify-center">
        <span className="text-sm font-semibold text-black">{storeName}</span>
        <span className="text-s font-semibold text-black">{usedDate}</span>
      </div>

      {/* 오른쪽: 가격 정보 */}
      <div className="flex-shrink-0 flex flex-col items-end justify-center">
        <span className="text-sm font-regular text-gray-500 line-through">
          {formatPrice(originalPrice)}
        </span>
        <span className="text-m font-semibold text-black">-{formatPrice(discountPrice)}</span>
      </div>
    </div>
  );
};

export default UsageHistoryItem;
