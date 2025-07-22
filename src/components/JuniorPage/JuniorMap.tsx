import React from 'react';
import MapContainer from '@/components/map/MapContainer';

const JuniorMap = () => {
  return (
    <div className="relative w-[393px] h-[351px] bg-white  ">
      {/* 타이틀 */}
      <div className="absolute top-[15px] left-[20px] w-auto h-auto">
        <p className="text-lm font-bold text-left text-black">이번주니어 지역</p>
      </div>

      {/* 지도 영역 - 타이틀 아래 적당한 간격으로 배치 */}
      <div
        className="absolute top-[50px] left-5 right-5 bottom-5"
        style={{ borderRadius: '12px', overflow: 'hidden' }}
      >
        <MapContainer />
      </div>
    </div>
  );
};

export default JuniorMap;
