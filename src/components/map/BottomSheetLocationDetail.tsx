import React from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import BookmarkStar from '@/components/common/BookmarkStar';
import StoreStatus from '@/components/common/StoreStatus';
import MiniLocationButton from '@/components/common/MiniLocationButton';
import PhoneButton from '@/components/common/PhoneButton';
import LocationIcon from '@/assets/common/locationIcon.svg?react';
import TimeIcon from '@/assets/common/timeIcon.svg?react';
import CouponIcon from '@/assets/common/couponIcon.svg?react';
import ArrowDownIcon from '@/assets/common/arrowDownIcon.svg?react';
import ArrowUpIcon from '@/assets/common/arrowUpIcon.svg?react';
import type { StoreData } from '@/types/storeDetail';

interface BottomSheetLocationDetailProps {
  isOpen: boolean;
  onClose: () => void;
  store: StoreData;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onBookmarkToggle?: (isBookmarked: boolean) => void;
  onLocationClick?: () => void;
  onPhoneClick?: () => void;
}

const BottomSheetLocationDetail: React.FC<BottomSheetLocationDetailProps> = ({
  isOpen,
  onClose,
  store,
  isExpanded,
  onToggleExpand,
  onBookmarkToggle,
  onLocationClick,
  onPhoneClick,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} disablePadding>
      <div className="relative w-full bg-white rounded-t-[20px] p-[19px] pb-[72px]">
        {/* 이벤트 매장 표시 */}
        {store.eventTypeCode !== 'NONE' && (
          <div className="text-pink-600 font-bold text-sm mb-1">이벤트 매장</div>
        )}

        {/* 즐겨찾기 */}
        <div className="absolute right-0 top-[5px]">
          <BookmarkStar
            isBookmarked={store.isBookmarked}
            onToggle={(next) => onBookmarkToggle?.(next)}
          />
        </div>

        {/* 매장명 */}
        <div className="mt-1">
          <h3 className="font-semibold text-lm text-black">{store.name}</h3>
        </div>

        {/* 주소 */}
        <div className="mt-1">
          <p className="font-regular text-sm text-gray-400 leading-[19px]">
            {store.address.length > 40 ? `${store.address.slice(0, 40)}...` : store.address}
          </p>
        </div>

        {/* 거리 · 시간 · 상태 */}
        <div className="mt-[16px] flex items-center justify-between">
          <div className="flex items-center gap-[6px] flex-wrap">
            <LocationIcon />
            <span className="text-sm text-gray-500">{store.distance}</span>
            <TimeIcon />
            <span className="text-sm text-gray-500">{store.hours}</span>
          </div>
          <StoreStatus status={store.status} />
        </div>

        {/* 혜택 정보 */}
        {store.benefitDesc && (
          <div className="mt-4 px-4 py-3 bg-gray-50 rounded-[8px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-pink-600">🎁</span>
              <span className="font-semibold text-sm text-black">혜택 정보</span>
            </div>
            <p className="text-sm text-gray-800 leading-[21px]">· {store.benefitDesc}</p>
          </div>
        )}

        {/* 쿠폰 섹션 */}
        <div className="mt-5 flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-[10px] h-[10px] bg-green-400 rounded-full" />
            <span className="font-semibold text-sm text-black leading-none relative top-[1px]">
              사용 가능한 쿠폰 {store.coupons.length}개
            </span>
          </div>
          <button onClick={onToggleExpand} className="p-1">
            {isExpanded ? (
              <ArrowUpIcon className="w-[18px] h-[10px] text-black" />
            ) : (
              <ArrowDownIcon className="w-[18px] h-[10px] text-black" />
            )}
          </button>
        </div>

        {/* 쿠폰 목록 */}
        {isExpanded && (
          <div className="mt-4 space-y-3">
            {store.coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="relative bg-white border border-[#D4D4D8] rounded-[5px] p-3 w-full h-[46px]"
              >
                <div className="absolute left-3 top-3">
                  <CouponIcon />
                </div>
                <div className="ml-8">
                  <h4 className="font-bold text-s text-black leading-[12px]">{coupon.title}</h4>
                  <p className="text-xs text-gray-400 mt-[2px]">{coupon.expiryDate} 까지</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="absolute left-[19px] right-[15px] bottom-[20px] flex gap-2">
          <MiniLocationButton onClick={onLocationClick} />
          <PhoneButton onClick={onPhoneClick} />
        </div>
      </div>
    </BottomSheet>
  );
};

export default BottomSheetLocationDetail;
