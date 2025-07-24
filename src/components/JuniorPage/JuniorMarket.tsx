import React from 'react';
import BookmarkCard from '../common/BookmarkCard';
import type { CategoryType } from '@/components/common/StoreTypeIcon';

type StoreStatusType = '영업중' | '휴무';

interface Coupon {
  id: string;
  title: string;
  expiryDate: string;
}

interface StoreType {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  category: CategoryType;
  status: StoreStatusType;
  isBookmarked: boolean;
  coupons: Coupon[];
  event: 'REQUIRE' | 'GENERAL' | null;
}

const getStoreColorClass = (event: string | null): string => {
  if (event === 'REQUIRE') return 'text-pink-400'; // 필수 이벤트
  if (event === 'GENERAL') return 'text-primary'; // 일반 이벤트
  return 'text-black'; // 기본 색상
};

const JuniorMarket = () => {
  const mockStores: StoreType[] = [
    {
      id: 'store1',
      name: '스타벅스 강남점',
      address: '서울 강남구 테헤란로 152',
      distance: '0.2km',
      hours: '06:00 - 22:00',
      category: 'CAFE' as CategoryType,
      status: '영업중',
      isBookmarked: false,
      coupons: [
        {
          id: 'coupon1',
          title: '아메리카노 10% 할인 쿠폰',
          expiryDate: '2025.08.16',
        },
      ],
      event: 'REQUIRE',
    },
    {
      id: 'store2',
      name: '이디야 커피 역삼점',
      address: '서울 강남구 역삼로 123',
      distance: '0.5km',
      hours: '07:00 - 21:00',
      category: 'CAFE' as CategoryType,
      status: '영업중',
      isBookmarked: true,
      coupons: [],
      event: 'GENERAL',
    },
    {
      id: 'store3',
      name: '투썸플레이스 삼성점',
      address: '서울 강남구 삼성로 456',
      distance: '1.2km',
      hours: '08:00 - 23:00',
      category: 'CAFE' as CategoryType,
      status: '영업중',
      isBookmarked: false,
      coupons: [
        {
          id: 'coupon2',
          title: '딸기 라떼 20% 할인 쿠폰',
          expiryDate: '2025.09.01',
        },
      ],
      event: 'GENERAL',
    },
    {
      id: 'store4',
      name: '빽다방 강남점',
      address: '서울 강남구 논현로 789',
      distance: '0.7km',
      hours: '06:30 - 22:30',
      category: 'CAFE' as CategoryType,
      status: '영업중',
      isBookmarked: false,
      coupons: [],
      event: 'GENERAL',
    },
  ];

  return (
    <div className="relative w-[393px] h-[351px] bg-white overflow-y-auto p-4">
      {/* 타이틀 */}
      <div className="mb-4">
        <p className="text-lm font-bold text-black">이번주니어 매장</p>
      </div>

      <div className="flex flex-col items-start gap-4">
        {mockStores.map((store) => {
          const colorClass = getStoreColorClass(store.event);
          return <BookmarkCard key={store.id} store={store} storeNameClass={colorClass} />;
        })}
      </div>
    </div>
  );
};

export default JuniorMarket;
