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

// --- 1. StoreInfo 인터페이스 수정 ---
// API 응답에 맞춰 쿠폰(coupons) 배열을 추가합니다.
// optional chaining(?.)을 사용하여 쿠폰이 없는 경우에도 오류가 발생하지 않도록 합니다.
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

  // 'compact' 모드는 기존과 동일하게 유지합니다.
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-md shadow-lg p-3 w-56">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-base text-black flex-grow min-w-0 break-words">
              {store.name}
            </h3>
            <div className="flex-shrink-0 cursor-pointer">
              <BookmarkStar isBookmarked={store.isBookmarked} onToggle={handleBookmarkClick} />
            </div>
          </div>
          <div className="mt-1">
            <p
              className="text-xs text-gray-600"
              style={{
                wordBreak: 'break-all',
                whiteSpace: 'normal',
              }}
            >
              {store.address}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TimeIcon className="w-3 h-3" />
            <span>{store.hours}</span>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. 'full' 모드 레이아웃 리팩터링 및 쿠폰 기능 추가 ---
  const bgColor = isDarkMode ? 'bg-[#251A49]' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const subTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-400';
  const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-200';
  const IconTime = isDarkMode ? TimeWhiteIcon : TimeIcon;

  return (
    <div
      // 고정 높이(h-[159px])를 제거하여 컨텐츠 길이에 따라 유연하게 높이가 조절되도록 합니다.
      className={`relative w-[353px] rounded-[8px] shadow-[0px_2px_10px_rgba(0,0,0,0.25)] transition-all duration-300 p-4 flex flex-col gap-2 ${bgColor} ${className}`}
    >
      {/* --- 상단 정보 (아이콘, 이름, 주소, 북마크) --- */}
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

      {/* --- 중간 정보 (시간, 영업상태) --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <IconTime />
          <span className={`font-regular text-sm ${subTextColor} relative top-px`}>
            {store.hours}
          </span>
        </div>
        <StoreStatus status={store.status} />
      </div>

      {/* --- 3. 쿠폰 목록 렌더링 섹션 (새로 추가된 부분) --- */}
      {store.coupons && store.coupons.length > 0 && (
        <div className={`mt-2 pt-3 border-t ${borderColor}`}>
          <div className="flex flex-col gap-2">
            {store.coupons.map((coupon) => (
              <div
                key={coupon.couponTemplateId}
                className="p-2 rounded-md bg-green-500/10 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-sm text-green-600">{coupon.couponName}</p>
                  <p className="text-xs text-gray-500">
                    {coupon.discountInfo || `~ ${coupon.couponEnd}`}
                  </p>
                </div>
                {/* 필요 시 여기에 다운로드 버튼 등을 추가할 수 있습니다. */}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 하단 버튼 --- */}
      <div className="mt-2 flex gap-2">
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
