// src/components/common/BookmarkCard.tsx

import type React from 'react';
import StoreTypeIcon, {
  type CategoryType,
  type StoreClassType,
  type EventType,
} from '@/components/common/StoreTypeIcon';
import BookmarkStar from '@/components/common/BookmarkStar';
import StoreStatus, { type StoreStatusType } from '@/components/common/StoreStatus';
import MiniLocationButton from '@/components/common/MiniLocationButton';
import PhoneButton from '@/components/common/PhoneButton';
import PhoneButtonDark from '@/components/common/PhoneButtonDark';
import TimeIcon from '@/assets/common/timeIcon.svg?react';
import TimeWhiteIcon from '@/assets/common/timeWhiteIcon.svg?react';

export interface StoreInfo {
  id: string;
  name: string;
  address: string;
  hours: string;
  category: CategoryType;
  storeClass: StoreClassType;
  event: EventType;
  status: StoreStatusType;
  isBookmarked: boolean;
  benefitDesc?: string;
  coupons?: {
    couponTemplateId: number;
    couponName: string;
    discountInfo: string | null;
    couponEnd: string;
  }[];
}

interface BookmarkCardProps {
  store: StoreInfo;
  onBookmarkToggle?: (storeId: string) => void;
  className?: string;
  isDarkMode?: boolean;
  variant?: 'full' | 'compact';
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
  store,
  onBookmarkToggle,
  className = '',
  isDarkMode = false,
  variant = 'full',
}) => {
  const handleBookmarkClick = () => {
    onBookmarkToggle?.(store.id);
  };

  const handleLocationClick = () => {
    console.log('위치보기버튼 클릭됨');
  };

  const handlePhoneClick = () => {
    console.log('전화버튼클릭됨');
  };

  if (variant === 'compact') {
    // ... (compact variant remains the same)
  }

  const bgColor = isDarkMode ? 'bg-[#251A49]' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const subTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-400';
  const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-200';
  const IconTime = isDarkMode ? TimeWhiteIcon : TimeIcon;

  const hasBenefitsOrCoupons = store.benefitDesc || (store.coupons && store.coupons.length > 0);

  return (
    <div
      className={`relative w-[353px] rounded-[8px] shadow-[0px_2px_10px_rgba(0,0,0,0.25)] transition-all duration-300 p-4 flex flex-col gap-2 ${bgColor} ${className}`}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <StoreTypeIcon
            category={store.category}
            storeClass={store.storeClass}
            event={store.event}
            size={50}
          />
        </div>
        <div className="flex-1 overflow-hidden pr-8">
          <h3 className={`font-semibold text-lm ${textColor} break-words`}>{store.name}</h3>
          <p
            className={`font-regular text-sm ${subTextColor} leading-[19px] mt-1`}
            style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}
          >
            {store.address}
          </p>
        </div>
        <div className="absolute right-[15px] top-[14px]">
          <BookmarkStar isBookmarked={store.isBookmarked} onToggle={handleBookmarkClick} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <IconTime />
          <span className={`font-regular text-sm ${subTextColor} relative top-px`}>
            {store.hours}
          </span>
        </div>
        <StoreStatus status={store.status} />
      </div>

      {hasBenefitsOrCoupons && (
        <div className={`mt-2 pt-3 border-t ${borderColor}`}>
          <div className="flex flex-col gap-2">
            {store.benefitDesc && (
              <div className="p-2 rounded-md bg-sky-500/10">
                <p className="font-bold text-sm text-sky-600">대표 혜택</p>
                <p className="text-xs text-gray-500 mt-1">{store.benefitDesc}</p>
              </div>
            )}

            {store.coupons?.map((coupon) => (
              <div
                key={coupon.couponTemplateId}
                className="p-2 rounded-md bg-green-500/10 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-sm text-green-600">{coupon.couponName}</p>
                  <p className="text-xs text-gray-500">
                    {coupon.discountInfo || `~ ${coupon.couponEnd.split('T')[0]}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-2 flex gap-2">
        <MiniLocationButton onClick={handleLocationClick} />
        {isDarkMode ? (
          <PhoneButtonDark onClick={handlePhoneClick} />
        ) : (
          <PhoneButton onClick={handlePhoneClick} />
        )}
      </div>
    </div>
  );
};

export default BookmarkCard;
