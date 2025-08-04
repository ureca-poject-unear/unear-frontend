// src/components/JuniorPage/JuniorMap.tsx (수정된 코드)

import React from 'react';
import MapContainer from '@/components/junior/MapContainer';
// 'StoreType'이 이 파일에서 더 이상 사용되지 않으므로 import 문을 제거해도 됩니다.
// import type { StoreType } from '@/types/Junior';

// [수정] 컴포넌트가 받는 props가 없으므로 인터페이스를 비워두거나 제거할 수 있습니다.

// [수정] 컴포넌트가 더 이상 props를 받지 않으므로 인자를 비워둡니다.
const JuniorMap = () => {
  return (
    <div className="px-5 bg-white">
      {/* 지도 위쪽 텍스트 */}
      <div className="m-2 mb-4 ">
        <p className="text-lm font-bold text-black">이번주니어 지역</p>
      </div>

      {/* 지도 */}
      <div className="relative h-[280px] w-[352px] mb-4">
        <MapContainer />
      </div>
    </div>
  );
};

export default JuniorMap;
