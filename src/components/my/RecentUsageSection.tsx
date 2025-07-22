import BackIcon from '@/assets/common/backIcon.svg?react';
import UsageHistoryItem from './UsageHistoryItem';

interface UsageHistoryData {
  id: number;
  storeName: string;
  usedDate: string;
  originalPrice: number;
  discountPrice: number;
  category: 'cafe' | 'food' | 'shopping' | 'education' | 'culture' | 'bakery' | 'beauty' | 'convenience' | 'activity' | 'popup';
  storeClass: 'franchise' | 'small-business' | 'event';
}

interface RecentUsageSectionProps {
  onDetailClick?: () => void;
}

const RecentUsageSection = ({ onDetailClick }: RecentUsageSectionProps) => {
  // 목업 데이터
  const mockUsageHistory: UsageHistoryData[] = [
    {
      id: 1,
      storeName: '스타벅스 강남점',
      usedDate: '7월 3일 17:29',
      originalPrice: 16000,
      discountPrice: 2400,
      category: 'cafe',
      storeClass: 'franchise',
    },
    {
      id: 2,
      storeName: '스타벅스 강남점',
      usedDate: '7월 3일 17:29',
      originalPrice: 16000,
      discountPrice: 2400,
      category: 'cafe',
      storeClass: 'franchise',
    },
    {
      id: 3,
      storeName: '스타벅스 강남점',
      usedDate: '7월 3일 17:29',
      originalPrice: 16000,
      discountPrice: 2400,
      category: 'cafe',
      storeClass: 'franchise',
    },
  ];

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
        <div className="flex justify-between items-center mb-4">
          <span className="text-lm font-semibold text-black">최근 이용 내역</span>
          <button type="button" className="flex items-center" onClick={handleDetailClick}>
            <span className="text-m font-semibold text-black">자세히 보기</span>
            <BackIcon className="w-5 h-5 mb-0.5 text-black transform rotate-180" />
          </button>
        </div>

        {/* 이용 내역 리스트 */}
        <div className="-mx-5 px-5 space-y-1">
          {mockUsageHistory.map((item) => (
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
        </div>
      </div>
    </div>
  );
};

export default RecentUsageSection;
