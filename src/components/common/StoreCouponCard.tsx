import type React from 'react';
import { useState } from 'react';
import StoreTypeIcon, { type CategoryType } from './StoreTypeIcon';
import BookmarkStar from './BookmarkStar';
import StoreStatus, { type StoreStatusType } from './StoreStatus';
import MiniLocationButton from '@/components/common/MiniLocationButton';
import PhoneButton from '@/components/common/PhoneButton';
import LocationIcon from '@/assets/common/locationIcon.svg?react';
import TimeIcon from '@/assets/common/timeIcon.svg?react';
import CouponIcon from '@/assets/common/couponIcon.svg?react';
import DownloadIcon from '@/assets/common/downloadIcon.svg?react';
import ArrowDownIcon from '@/assets/common/arrowDownIcon.svg?react';
import ArrowUpIcon from '@/assets/common/arrowUpIcon.svg?react';
import { Loader2 } from 'lucide-react';

interface Coupon {
  id: string;
  title: string;
  expiryDate: string;
  downloaded?: boolean;
}

interface StoreInfo {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  category: CategoryType;
  status: StoreStatusType;
  isBookmarked: boolean;
  coupons: Coupon[];
}

interface StoreCouponCardProps {
  store: StoreInfo;
  onBookmarkToggle?: (storeId: string, isBookmarked: boolean) => void;
  className?: string;
}

const StoreCouponCard: React.FC<StoreCouponCardProps> = ({
  store,
  onBookmarkToggle,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [downloadedCoupons, setDownloadedCoupons] = useState<Set<string>>(new Set());
  const [downloadingCoupons, setDownloadingCoupons] = useState<Set<string>>(new Set());

  const handleBookmarkToggle = (isBookmarked: boolean) => {
    onBookmarkToggle?.(store.id, isBookmarked);
  };

  const handleLocationClick = () => {
    console.log('위치보기버튼 클릭됨');
  };

  const handlePhoneClick = () => {
    console.log('전화버튼클릭됨');
  };

  const handleCouponDownload = (couponId: string) => {
    setDownloadingCoupons((prev) => new Set(prev).add(couponId));
    console.log('다운로드 시작됨');

    setTimeout(() => {
      setDownloadingCoupons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(couponId);
        return newSet;
      });
      setDownloadedCoupons((prev) => new Set(prev).add(couponId));
      console.log('다운로드 완료됨');
    }, 1000); // 1초 지연
  };

  return (
    <div
      className={`
        relative
        w-[353px]
        bg-white
        rounded-[8px]
        shadow-[0px_2px_10px_rgba(0,0,0,0.25)]
        transition-all duration-300
        pl-[19px] pr-[15px] pt-[19px] pb-[72px]
        ${className}
      `}
    >
      {/* 매장 아이콘 */}
      <div className="absolute left-[19px] top-[19px]">
        <StoreTypeIcon category={store.category} storeClass="franchise" size={50} />
      </div>

      {/* 즐겨찾기 */}
      <div className="absolute right-[15px] top-[14px]">
        <BookmarkStar isBookmarked={store.isBookmarked} onToggle={handleBookmarkToggle} />
      </div>

      {/* 매장명 */}
      <div className="absolute left-[85px] top-[19px]">
        <h3 className="font-semibold text-lm text-black">{store.name}</h3>
      </div>

      {/* 주소 */}
      <div className="absolute left-[85px] top-[46px]">
        <p className="font-regular text-sm text-gray-400 leading-[19px]">{store.address}</p>
      </div>

      {/* 거리 & 시간 & 상태 */}
      <div className="absolute left-[19px] right-[15px] top-[80px] flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <LocationIcon />
          <span className="font-regular text-sm text-gray-500 relative top-[2px]">
            {store.distance}
          </span>
          <TimeIcon />
          <span className="font-regular text-sm text-gray-500 relative top-[2px]">
            {store.hours}
          </span>
        </div>
        <StoreStatus status={store.status} className="relative top-[1px]" />
      </div>

      {/* 쿠폰 섹션 */}
      <div className="mt-[94px] flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="w-[10px] h-[10px] bg-green-400 rounded-full" />
          <span className="font-semibold text-sm text-black leading-none relative top-[1px]">
            사용 가능한 쿠폰 {store.coupons.length}개
          </span>
        </div>

        {/* 화살표 버튼 */}
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-1">
          {isExpanded ? (
            <ArrowUpIcon className="w-[18px] h-[10px] text-black" />
          ) : (
            <ArrowDownIcon className="w-[18px] h-[10px] text-black" />
          )}
        </button>
      </div>

      {/* 쿠폰 목록 */}
      {isExpanded && (
        <div className="mt-[14px] space-y-[10px]">
          {store.coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="relative bg-white border border-[#D4D4D8] rounded-[5px] p-3 w-[318px] h-[46px]"
            >
              <div className="absolute left-3 top-3">
                <CouponIcon />
              </div>
              <div className="ml-8">
                <h4 className="font-bold text-s text-black leading-[12px]">{coupon.title}</h4>
                <p className="font-regular text-xs text-gray-400 leading-[13px]">
                  {coupon.expiryDate}
                </p>
              </div>
              {!coupon.downloaded && !downloadedCoupons.has(coupon.id) && (
                <button
                  onClick={() => handleCouponDownload(coupon.id)}
                  className="absolute right-3 top-[13px] w-5 h-5 flex items-center justify-center"
                  disabled={downloadingCoupons.has(coupon.id)}
                >
                  {downloadingCoupons.has(coupon.id) ? (
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
      {/* 하단 버튼(위치보기, 전화) */}
      <div className="absolute left-[19px] right-[15px] bottom-[20px] flex gap-2">
        <MiniLocationButton onClick={handleLocationClick} />
        <PhoneButton onClick={handlePhoneClick} />
      </div>
    </div>
  );
};

export default StoreCouponCard;

/*
- 사용법
{
      id: 'store1',
      name: '스타벅스 강남점',
      address: '서울 강남구 테헤란로 152',
      distance: '0.2km',
      hours: '06:00 - 22:00',
      category: 'cafe' as const,
      status: '영업중' as const,
      isBookmarked: bookmarkStatus.store1 || false,
      coupons: [
        {
          id: 'coupon1',
          title: '아메리카노 10% 할인 쿠폰',
          expiryDate: '2025. 08. 16까지',
          downloaded: false,
        },
        {
          id: 'coupon2',
          title: '라떼 15% 할인 쿠폰',
          expiryDate: '2025. 08. 16까지',
          downloaded: false,
        },
      ],
    }
    다음과 같은 형태로 정적데이터를 마련할 수 있습니다.
    따라서 api 연결을 하게 되면 해당 형식에 맞춰서 api로 받은 응답값을 이용하면 됩니다.
    타입이 필요한 경우, 타입을 import해와도 되고 const처리해도 되며, 사용자의 편의대로
    타입을 처리할 수 있습니다.

    -사용예시
      <StoreCouponCard
        store={{
          ...sampleStore, //데이터
          isBookmarked,
        }}
        onBookmarkToggle={handleBookmarkToggle}
      />
    
*/
