// src/components/JuniorPage/JuniorMap.tsx (수정된 코드)

import React from 'react';
import MapContainer from '@/components/junior/MapContainer';
import type { StoreType } from '@/types/Junior';

// 부모로부터 받을 props 타입 정의
interface JuniorMapProps {
  stores: StoreType[]; // 이 프롭은 이제 MapContainer에 전달되지 않지만,
  // JuniorMap의 다른 부분(예: 지도 아래 목록)에서 사용될 수 있으므로 남겨둡니다.
  onBookmarkToggle: (storeId: string) => void;
}

const JuniorMap = ({ onBookmarkToggle }: JuniorMapProps) => {
  // MapContainer가 number 타입의 ID로 호출할 때,
  // 이를 string으로 변환하여 부모 컴포넌트의 onBookmarkToggle 함수를 호출하는 어댑터 함수
  const handleBookmarkToggleAdapter = (placeId: number) => {
    onBookmarkToggle(placeId.toString());
  };

  return (
    <div className="w-full bg-white">
      {/* 지도 위쪽 텍스트 */}
      <div className="px-5 py-4">
        <p className="text-lm font-bold text-black">이번주니어 지역</p>
      </div>

      {/* 지도 */}
      <div className="px-5 pb-4">
        <div className="relative w-full h-[280px] max-w-[calc(100%-0px)] mx-auto mb-4">
          {/*
            [수정] MapContainer는 자체적으로 데이터를 로드하므로 stores 프롭을 전달하지 않습니다.
          */}
          <MapContainer onBookmarkToggle={handleBookmarkToggleAdapter} />
        </div>
      </div>
    </div>
  );
};

export default JuniorMap;
