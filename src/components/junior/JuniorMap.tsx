// src/components/JuniorPage/JuniorMap.tsx (수정된 코드)

import React, { forwardRef } from 'react';
import MapContainer from '@/components/junior/MapContainer';
import type { MapActions } from '@/components/junior/MapContainer'; // MapActions 타입 임포트

// [수정] forwardRef를 사용하여 부모 컴포넌트로부터 ref를 전달받음
const JuniorMap = forwardRef<MapActions>((props, ref) => {
  return (
    <div className="w-[393px] p-4 bg-white">
      {/* 지도 위쪽 텍스트 */}
      <div className="m-2 mb-4">
        <p className="text-lm font-bold text-black">이번주니어 지역</p>
      </div>

      {/* 지도 */}
      <div className="relative h-[280px] w-[352px] mb-4">
        {/*
          [수정] 부모로부터 받은 ref를 MapContainer 컴포넌트에 전달합니다.
          (참고: MapContainer 컴포넌트도 forwardRef와 useImperativeHandle로 구현되어야 합니다.)
        */}
        <MapContainer ref={ref} />
      </div>
    </div>
  );
});

// displayName 설정 (React 개발자 도구에서 컴포넌트 이름을 쉽게 식별하기 위함)
JuniorMap.displayName = 'JuniorMap';

export default JuniorMap;
