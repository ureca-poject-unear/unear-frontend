import { useState } from 'react'; // 여기에 추가하세요
import { useLocation } from 'react-router-dom';
import StoryLayout from '@/components/story/StoryLayout';
import BookmarkCard from '@/components/common/BookmarkCard';
import PointNubiImage from '@/assets/story/pointNubi.png';
// 타입 임포트
import type { CategoryType } from '@/components/common/StoreTypeIcon';
import type { StoreStatusType } from '@/components/common/StoreStatus';

interface StoreInfo {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  category: CategoryType;
  status: StoreStatusType;
  isBookmarked: boolean;
}

// 예시 매장 데이터
const sampleStores: StoreInfo[] = [
  {
    id: '1',
    name: '맛있는 햄버거 집',
    address: '서울시 강남구 테헤란로 123',
    distance: '500m',
    hours: '10:00 - 22:00',
    category: 'cafe',
    status: '영업중',
    isBookmarked: false,
  },
  {
    id: '2',
    name: '행복한 빵집',
    address: '서울시 강남구 역삼동 456',
    distance: '1.2km',
    hours: '08:00 - 20:00',
    category: 'bakery',
    status: '영업종료',
    isBookmarked: true,
  },
  {
    id: '3',
    name: '청담동 카페',
    address: '서울시 강남구 청담동 789',
    distance: '2.5km',
    hours: '09:00 - 23:00',
    category: 'cafe',
    status: '영업중',
    isBookmarked: false,
  },
  {
    id: '4',
    name: '맛집 한식당',
    address: '서울시 강남구 논현동 321',
    distance: '1.8km',
    hours: '11:00 - 21:00',
    category: 'food',
    status: '영업중',
    isBookmarked: false,
  },
  {
    id: '5',
    name: '신사동 베이커리',
    address: '서울시 강남구 신사동 654',
    distance: '3.0km',
    hours: '07:00 - 19:00',
    category: 'bakery',
    status: '영업중',
    isBookmarked: true,
  },
];

const StoryRecommendPage = () => {
  const location = useLocation();
  const diagnosisLabel = location.state?.diagnosis?.label ?? '쩝쩝박사';

  const [stores, setStores] = useState<StoreInfo[]>(sampleStores);

  const handleBookmarkToggle = (storeId: string, isBookmarked: boolean) => {
    setStores((prev: StoreInfo[]) =>
      prev.map((store: StoreInfo) => (store.id === storeId ? { ...store, isBookmarked } : store))
    );
  };

  return (
    <StoryLayout headerTitle="추천 매장" bgColorClass="bg-storybackground1">
      {/* 상단 진단 결과 섹션 */}
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-white text-lm font-bold mb-1">[{diagnosisLabel}]</p>
          <p className="text-white text-m font-semibold mb-2">OOO님이 좋아할 만한 제휴처</p>
          <p className="text-gray-300 text-sm font-regular">🔥내 주변 추천 매장을 확인해보세요🔥</p>
        </div>
        <div>
          <img src={PointNubiImage} />
        </div>
      </div>

      {/* 추천 매장 리스트 */}
      <div className="space-y-4 mb-6">
        {stores.map((store: StoreInfo) => (
          <BookmarkCard
            key={store.id}
            store={store}
            onBookmarkToggle={handleBookmarkToggle}
            isDarkMode={true}
          />
        ))}
      </div>
    </StoryLayout>
  );
};

export default StoryRecommendPage;
