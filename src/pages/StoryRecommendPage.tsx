import { useState } from 'react'; // 여기에 추가하세요
import { useLocation } from 'react-router-dom';
import Header from '@/components/common/Header';
import BookmarkCard from '@/components/common/BookmarkCard';
import PointNubiImage from '@/assets/story/pointNubi.png';
import StarBackgroundImage from '@/assets/story/starBackground.png';
// 타입 임포트
import type { CategoryType, StoreClassType, EventType } from '@/components/common/StoreTypeIcon';
import type { BookmarkStore } from '@/types/bookmark';

// 예시 매장 데이터
const sampleStores: BookmarkStore[] = [
  {
    id: '1',
    placeId: 1,
    name: '맛있는 햄버거 집',
    address: '서울시 강남구 테헤란로 123',
    distance: '500m',
    hours: '10:00 - 22:00',
    category: 'CAFE',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    isBookmarked: false,
    latitude: 37.5665,
    longitude: 126.978,
  },
  {
    id: '2',
    placeId: 2,
    name: '행복한 빵집',
    address: '서울시 강남구 역삼동 456',
    distance: '1.2km',
    hours: '08:00 - 20:00',
    category: 'BAKERY',
    storeClass: 'FRANCHISE',
    event: 'GENERAL',
    isBookmarked: true,
    latitude: 37.5,
    longitude: 127.03,
  },
  {
    id: '3',
    placeId: 3,
    name: '청담동 카페',
    address: '서울시 강남구 청담동 789',
    distance: '2.5km',
    hours: '09:00 - 23:00',
    category: 'CAFE',
    storeClass: 'LOCAL',
    event: 'REQUIRE',
    isBookmarked: false,
    latitude: 37.52,
    longitude: 127.04,
  },
  {
    id: '4',
    placeId: 4,
    name: '맛집 한식당',
    address: '서울시 강남구 논현동 321',
    distance: '1.8km',
    hours: '11:00 - 21:00',
    category: 'FOOD',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    isBookmarked: false,
    latitude: 37.51,
    longitude: 127.02,
  },
  {
    id: '5',
    placeId: 5,
    name: '신사동 베이커리',
    address: '서울시 강남구 신사동 654',
    distance: '3.0km',
    hours: '07:00 - 19:00',
    category: 'BAKERY',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    isBookmarked: true,
    latitude: 37.53,
    longitude: 127.035,
  },
];

const StoryRecommendPage = () => {
  const location = useLocation();
  const diagnosisLabel = location.state?.diagnosis?.label ?? '쩝쩝박사';

  const [stores, setStores] = useState<BookmarkStore[]>(sampleStores);

  const handleBookmarkToggle = (storeId: string) => {
    setStores((prev: BookmarkStore[]) =>
      prev.map((store: BookmarkStore) =>
        store.id === storeId ? { ...store, isBookmarked: !store.isBookmarked } : store
      )
    );
  };

  return (
    <div className="overflow-hidden w-full h-full bg-storybackground1">
      <Header title="추천 매장" bgColor="bg-story" textColor="text-white" iconColor="text-white" />

      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover -z-100 opacity-40"
        style={{
          backgroundImage: `url(${StarBackgroundImage})`,
        }}
      />

      {/* 컨텐츠 */}
      <div className="relative z-10 mx-5 pt-4 pb-6">
        {/* 상단 진단 결과 섹션 */}
        <div className="flex items-center justify-between py-2 mb-6">
          <div>
            <p className="text-white text-lm font-bold mb-1">[{diagnosisLabel}]</p>
            <p className="text-white text-m font-semibold mb-2">OOO님이 좋아할 만한 제휴처</p>
            <p className="text-gray-300 text-sm font-regular">
              🔥내 주변 추천 매장을 확인해보세요🔥
            </p>
          </div>
          <div>
            <img src={PointNubiImage} alt="포인트 누비" />
          </div>
        </div>

        {/* 추천 매장 리스트 */}
        <div className="space-y-4">
          {stores.map((store: BookmarkStore) => (
            <BookmarkCard
              key={store.id}
              store={store}
              onBookmarkToggle={handleBookmarkToggle}
              isDarkMode={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryRecommendPage;
