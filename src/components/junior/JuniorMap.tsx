// src/components/JuniorPage/JuniorMap.tsx (수정된 코드)

import { forwardRef } from 'react';
import MapContainer, { type MapActions } from '@/components/junior/MapContainer';

// forwardRef를 사용하여 부모 컴포넌트로부터 ref를 전달받음
const JuniorMap = forwardRef<MapActions>((props, ref) => {
  return (
    <div className="w-full p-5 bg-white">
      {/* 지도 위쪽 텍스트 */}
      <div className="mb-3">
        <p className="text-lm font-bold text-black">이번주니어 지역</p>
      </div>

      {/* 지도 */}
      <div className="relative h-[280px] w-full">
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
