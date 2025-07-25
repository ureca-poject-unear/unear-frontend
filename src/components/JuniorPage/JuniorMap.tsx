// src/components/JuniorPage/JuniorMap.tsx

import React from 'react';
import MapContainer from './MapContainer';
import type { StoreType } from '@/types/Junior'; // [수정] 임포트 경로 변경

// 부모로부터 받을 props 타입 정의
interface JuniorMapProps {
  stores: StoreType[];
  onBookmarkToggle: (storeId: string) => void;
}

const JuniorMap = ({ stores, onBookmarkToggle }: JuniorMapProps) => {
  return (
    <div className="px-5  bg-white">
      {/* 지도 위쪽 텍스트 */}
      <div className="m-4">
        <p className="text-lm font-bold text-black">이번주니어 지역</p>
      </div>

      {/* 지도 */}
      <div className="relative h-[280px] w-[352px] mb-4">
        <MapContainer stores={stores} onBookmarkToggle={onBookmarkToggle} />
      </div>
    </div>
  );
};

export default JuniorMap;
