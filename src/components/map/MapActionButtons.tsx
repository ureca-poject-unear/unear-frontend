import { useState } from 'react';
import EventIcon from '@/assets/map/eventIcon.svg?react';
import MapCouponIcon from '@/assets/map/mapCouponIcon.svg?react';
import BarcodeIcon from '@/assets/map/barcodeIcon.svg?react';
import MapUpArrowIcon from '@/assets/map/mapUpArrowIcon.svg?react';
import MapDownArrowIcon from '@/assets/map/mapDownArrowIcon.svg?react';

interface Props {
  onEventClick: () => void;
  onBarcodeClick: () => void;
  onCouponClick: () => void;
}

const MapActionButtons = ({ onEventClick, onBarcodeClick, onCouponClick }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="absolute bottom-[24px] left-[10px] z-20 w-[45px] flex flex-col items-center">
      {/* 버튼 그룹 */}
      <div
        className={`flex flex-col gap-[10px] items-center transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded
            ? 'translate-y-0 opacity-100 max-h-[300px]'
            : 'translate-y-10 opacity-0 max-h-0'
        }`}
      >
        {/* 이벤트 버튼 */}
        <button
          onClick={onEventClick}
          className="relative w-[45px] h-[45px] transition-transform duration-300"
        >
          <div className="absolute inset-0 bg-white drop-shadow-[0_0_4px_rgba(0,0,0,0.25)] hover:bg-gray-50 active:bg-gray-100 rounded-full" />
          <EventIcon className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[21px] h-[21px]" />
          <span className="absolute bottom-[5px] left-1/2 -translate-x-1/2 text-[6px] font-semibold leading-[8px] text-[#333]">
            이벤트
          </span>
        </button>

        {/* 쿠폰 버튼 */}
        <button
          onClick={onCouponClick}
          className="relative w-[45px] h-[45px] transition-transform duration-300"
        >
          <div className="absolute inset-0 bg-white drop-shadow-[0_0_4px_rgba(0,0,0,0.25)] hover:bg-gray-50 active:bg-gray-100 rounded-full" />
          <MapCouponIcon className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[22.5px] h-[22.5px]" />
          <span className="absolute bottom-[5px] left-1/2 -translate-x-1/2 text-[6px] font-semibold leading-[8px] text-[#333]">
            쿠폰
          </span>
        </button>

        {/* 바코드 버튼 */}
        <button
          onClick={onBarcodeClick}
          className="relative w-[45px] h-[45px] transition-transform"
        >
          <div className="absolute inset-0 bg-white drop-shadow-[0_0_4px_rgba(0,0,0,0.25)] hover:bg-gray-50 active:bg-gray-100 rounded-full" />
          <BarcodeIcon className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[25px] h-[25px]" />
          <span className="absolute bottom-[6px] left-1/2 -translate-x-1/2 text-[6px] font-semibold leading-[8px] text-[#333]">
            바코드
          </span>
        </button>
      </div>

      {/* 화살표 토글 버튼 */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="relative w-[45px] h-[45px] mt-[10px] transition-transform"
      >
        <div className="absolute inset-0 bg-white drop-shadow-[0_0_4px_rgba(0,0,0,0.25)] hover:bg-gray-50 active:bg-gray-100 rounded-full" />
        {isExpanded ? (
          <MapDownArrowIcon className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[25px] h-[33px]" />
        ) : (
          <MapUpArrowIcon className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[25px] h-[33px]" />
        )}
      </button>
    </div>
  );
};

export default MapActionButtons;
