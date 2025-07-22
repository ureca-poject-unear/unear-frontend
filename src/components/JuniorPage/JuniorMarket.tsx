import React from 'react';
import BookmarkCard from '../common/BookmarkCard';
const JuniorMarket = () => {
  const mockStores = [
    {
      id: 'store1',
      name: '스타벅스 강남점',
      address: '서울 강남구 테헤란로 152',
      distance: '0.2km',
      hours: '06:00 - 22:00',
      category: 'cafe' as CategoryType,
      status: '영업중' as StoreStatusType,
      isBookmarked: false,
      coupons: [
        {
          id: 'coupon1',
          title: '아메리카노 10% 할인 쿠폰',
          expiryDate: '2025.08.16',
        },
      ],
    },
    {
      id: 'store1',
      name: '스타벅스 강남점',
      address: '서울 강남구 테헤란로 152',
      distance: '0.2km',
      hours: '06:00 - 22:00',
      category: 'cafe' as CategoryType,
      status: '영업중' as StoreStatusType,
      isBookmarked: false,
      coupons: [
        {
          id: 'coupon1',
          title: '아메리카노 10% 할인 쿠폰',
          expiryDate: '2025.08.16',
        },
      ],
    },
  ];

  return (
    <div className="relative w-[393px] h-[351px] bg-white  ">
      {/* 타이틀 */}
      <div className="absolute top-[15px] left-[20px] w-auto h-auto">
        <p className="text-lm font-bold text-left text-black">이번주니어 매장</p>
        <div className="flex flex-col items-center gap-[23px]">
          {mockStores.map((store) => (
            <BookmarkCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JuniorMarket;
