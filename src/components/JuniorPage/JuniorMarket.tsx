// src/components/JuniorPage/JuniorMarket.tsx

import React from 'react';
import BookmarkCard from '@/components/common/BookmarkCard';
import type { StoreType, EventType } from '@/types/Junior'; // [수정] 임포트 경로 변경

// 부모로부터 받을 props 타입 정의
interface JuniorMarketProps {
  stores: StoreType[];
  onBookmarkToggle: (storeId: string) => void;
}

const getStoreColorClass = (event: EventType): string => {
  if (event === 'REQUIRE') return 'text-pink-400';
  if (event === 'GENERAL') return 'text-primary';
  return 'text-black';
};

const JuniorMarket = ({ stores, onBookmarkToggle }: JuniorMarketProps) => {
  return (
    <div className="relative bg-white pl-5 pr-5">
      <div className="m-2 mb-4">
        <p className="text-lm font-bold text-black">이번주니어 매장</p>
      </div>
      <div className="flex flex-col items-start gap-4 mb-2">
        {stores.map((store) => {
          const colorClass = getStoreColorClass(store.event);
          return (
            <BookmarkCard
              key={store.id}
              store={store}
              storeNameClass={colorClass}
              onBookmarkToggle={() => onBookmarkToggle(store.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default JuniorMarket;
