import type React from 'react';
import StoreTypeIcon, {
  type CategoryType,
  type StoreClassType,
  type EventType,
} from './StoreTypeIcon';
import BookmarkStar from './BookmarkStar';
import StoreStatus, { type StoreStatusType } from './StoreStatus';
import MiniLocationButton from '@/components/common/MiniLocationButton';
import PhoneButton from '@/components/common/PhoneButton';
import PhoneButtonDark from '@/components/common/PhoneButtonDark';
import LocationIcon from '@/assets/common/locationIcon.svg?react';
import TimeIcon from '@/assets/common/timeIcon.svg?react';
import LocationWhiteIcon from '@/assets/common/locationWhiteIcon.svg?react';
import TimeWhiteIcon from '@/assets/common/timeWhiteIcon.svg?react';

interface StoreInfo {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  category: CategoryType;
  storeClass: StoreClassType;
  event: EventType;
  status: StoreStatusType;
  isBookmarked: boolean;
}

interface BookmarkCardProps {
  store: StoreInfo;
  onBookmarkToggle?: (storeId: string, isBookmarked: boolean) => void;
  className?: string;
  isDarkMode?: boolean;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
  store,
  onBookmarkToggle,
  className = '',
  isDarkMode = false,
}) => {
  const handleBookmarkToggle = (isBookmarked: boolean) => {
    onBookmarkToggle?.(store.id, isBookmarked);
  };

  const handleLocationClick = () => {
    console.log('위치보기버튼 클릭됨');
  };

  const handlePhoneClick = () => {
    console.log('전화버튼클릭됨');
  };

  const bgColor = isDarkMode ? 'bg-[#251A49]' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const subTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-400';
  const IconLocation = isDarkMode ? LocationWhiteIcon : LocationIcon;
  const IconTime = isDarkMode ? TimeWhiteIcon : TimeIcon;

  return (
    <div
      className={`relative w-[353px] h-[159px] rounded-[8px] shadow-[0px_2px_10px_rgba(0,0,0,0.25)] transition-all duration-300 pl-[19px] pr-[15px] pt-[19px] ${bgColor} ${className}`}
    >
      {/* 매장 아이콘 */}
      <div className="absolute left-[19px] top-[19px]">
        <StoreTypeIcon
          category={store.category}
          storeClass={store.storeClass}
          event={store.event}
          size={50}
        />
      </div>

      {/* 즐겨찾기 */}
      <div className="absolute right-[15px] top-[14px]">
        <BookmarkStar isBookmarked={store.isBookmarked} onToggle={handleBookmarkToggle} />
      </div>

      {/* 매장명 */}
      <div className="absolute left-[85px] top-[19px]">
        <h3 className={`font-semibold text-lm ${textColor}`}>{store.name}</h3>
      </div>

      {/* 주소 */}
      <div className="absolute left-[85px] top-[46px]">
        <p className={`font-regular text-sm ${subTextColor} leading-[19px]`}>{store.address}</p>
      </div>

      {/* 거리 & 시간 & 상태 */}
      <div className="absolute left-[19px] right-[15px] top-[80px] mb-[10px] flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <IconLocation />
          <span className={`font-regular text-sm ${subTextColor} relative top-[2px]`}>
            {store.distance}
          </span>
          <IconTime />
          <span className={`font-regular text-sm ${subTextColor} relative top-[2px]`}>
            {store.hours}
          </span>
        </div>
        <StoreStatus status={store.status} className="relative top-[1px]" />
      </div>

      {/* 하단 버튼 */}
      <div className="absolute left-[19px] right-[15px] bottom-[15px] flex gap-2">
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

/*
- 사용법
  <StoreCouponCard
    store={{ ...sampleStore, isBookmarked }}
    onBookmarkToggle={handleBookmarkToggle}
    isDarkMode={false} //true 혹은 isDarkMode 생략시 라이트 모드
  />
*/
