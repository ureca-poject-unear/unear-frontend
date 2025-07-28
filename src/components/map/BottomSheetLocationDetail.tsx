import React, { useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import BookmarkStar from '@/components/common/BookmarkStar';
import StoreStatus from '@/components/common/StoreStatus';
import LocationButton from '@/components/common/LocationButton';
import CallButton from '@/components/common/CallButton';
import LocationIcon from '@/assets/common/locationIcon.svg?react';
import TimeIcon from '@/assets/common/timeIcon.svg?react';
import CouponIcon from '@/assets/common/couponIcon.svg?react';
import GiftIcon from '@/assets/map/giftIcon.svg?react';
import ArrowDownIcon from '@/assets/common/arrowDownIcon.svg?react';
import ArrowUpIcon from '@/assets/common/arrowUpIcon.svg?react';
import DownloadIcon from '@/assets/common/downloadIcon.svg?react';
import { Loader2 } from 'lucide-react';
import { postDownloadCoupon } from '@/apis/postDownloadCoupon';
import type { StoreData } from '@/types/storeDetail';
import type { MapContainerRef } from '@/components/map/MapContainer';
import { toggleFavorite } from '@/apis/postFavorite';

interface BottomSheetLocationDetailProps {
  isOpen: boolean;
  onClose: () => void;
  store: StoreData;
  mapRef: React.RefObject<MapContainerRef | null>;
}

const BottomSheetLocationDetail: React.FC<BottomSheetLocationDetailProps> = ({
  isOpen,
  onClose,
  store,
  mapRef,
}) => {
  console.log('store 데이터 확인:', store);
  const [downloadedCoupons, setDownloadedCoupons] = useState<Set<string>>(new Set());
  const [downloadingCoupons, setDownloadingCoupons] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(store.isBookmarked);

  const handleCouponDownload = async (couponId: string) => {
    setDownloadingCoupons((prev) => new Set(prev).add(couponId));

    try {
      await postDownloadCoupon(Number(couponId));
      setDownloadedCoupons((prev) => new Set(prev).add(couponId));
    } catch (err) {
      console.error('쿠폰 다운로드 실패:', err);
      alert('쿠폰 다운로드에 실패했습니다.');
    } finally {
      setDownloadingCoupons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(couponId);
        return newSet;
      });
    }
  };

  const handleBookmarkToggle = async () => {
    const prev = isBookmarked;
    setIsBookmarked(!prev); // 💡 낙관적 UI 처리

    try {
      await toggleFavorite(store.placeId);
    } catch (err) {
      console.error('즐겨찾기 변경 실패:', err);
      alert('즐겨찾기 변경에 실패했습니다.');
      setIsBookmarked(prev); // 실패 시 롤백
    }
  };

  const handleLocationClick = () => {
    mapRef.current?.setCenter(store.latitude, store.longitude);
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${store.tel}`;
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} disablePadding>
      <div className="relative w-full bg-white rounded-t-[20px] p-[19px] pb-[72px]">
        {store.eventTypeCode !== 'NONE' && (
          <div className="text-pink-600 font-bold text-sm mb-1">이벤트 매장</div>
        )}

        <div className="absolute right-[15px] top-[19px]">
          <BookmarkStar isBookmarked={isBookmarked} onToggle={handleBookmarkToggle} />
        </div>

        <div className="mt-1">
          <h3 className="font-semibold text-lm text-black">{store.name}</h3>
        </div>

        <div className="mt-1">
          <p className="font-regular text-sm text-gray-400 leading-[19px] max-w-[330px]">
            {store.address}
          </p>
        </div>

        <div className="mt-[16px] flex items-center justify-between">
          <div className="flex items-center gap-[6px] flex-wrap">
            <LocationIcon />
            <span className="text-sm text-gray-500">{store.distance}</span>
            <TimeIcon />
            <span className="text-sm text-gray-500">{store.hours}</span>
          </div>
          <StoreStatus status={store.status} />
        </div>

        {store.benefitDesc && (
          <div className="mt-4 px-4 py-3 bg-gray-100 rounded-[8px]">
            <div className="flex items-center gap-2 mb-1">
              <GiftIcon />
              <span className="font-semibold text-sm mt-[3px] text-black">혜택 정보</span>
            </div>
            <p className="font-semibold text-sm text-gray-800 leading-[21px]">
              · {store.benefitDesc}
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="w-[10px] h-[10px] bg-green-400 rounded-full" />
            <span className="font-semibold text-sm text-black leading-none relative top-[1px]">
              사용 가능한 쿠폰 {store.coupons.length}개
            </span>
          </div>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1">
            {isExpanded ? (
              <ArrowUpIcon className="w-[18px] h-[10px] text-black" />
            ) : (
              <ArrowDownIcon className="w-[18px] h-[10px] text-black" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {store.coupons.map((coupon) => (
              <div
                key={coupon.couponTemplateId}
                className="relative bg-white border border-[#D4D4D8] rounded-[5px] p-3 w-full h-[46px]"
              >
                <div className="absolute left-3 top-3">
                  <CouponIcon />
                </div>
                <div className="ml-8">
                  <h4 className="font-bold text-s text-black leading-[12px]">
                    {coupon.couponName}
                  </h4>
                  <p className="text-xs text-gray-400 mt-[2px]">
                    {coupon.couponEnd?.split('T')[0]} 까지
                  </p>
                </div>
                {!coupon.downloaded && !downloadedCoupons.has(String(coupon.couponTemplateId)) && (
                  <button
                    onClick={() => handleCouponDownload(String(coupon.couponTemplateId))}
                    className="absolute right-3 top-[13px] w-5 h-5 flex items-center justify-center"
                    disabled={downloadingCoupons.has(String(coupon.couponTemplateId))}
                  >
                    {downloadingCoupons.has(String(coupon.couponTemplateId)) ? (
                      <Loader2 className="w-5 h-5 animate-spin text-black" />
                    ) : (
                      <DownloadIcon className="w-5 h-5 text-black" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="absolute left-[20px] right-[20px] bottom-[15px] flex justify-between gap-2">
          <LocationButton onClick={handleLocationClick} width={169} />
          <CallButton onClick={handlePhoneClick} width={169} />
        </div>
      </div>
    </BottomSheet>
  );
};

export default BottomSheetLocationDetail;
