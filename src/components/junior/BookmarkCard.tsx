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
import LocationIcon from '@/assets/common/locationIcon.svg?react';
import TimeIcon from '@/assets/common/timeIcon.svg?react';
import LocationWhiteIcon from '@/assets/common/locationWhiteIcon.svg?react';
import TimeWhiteIcon from '@/assets/common/timeWhiteIcon.svg?react';

// export하여 MapContainer 등 다른 파일에서 이 타입을 재사용할 수 있게 합니다.
export interface StoreInfo {
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
  onBookmarkToggle?: (storeId: string) => void; // storeId만 받도록 수정
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
  // BookmarkStar의 onToggle은 isBookmarked 값을 넘겨주지만,
  // 상위 컴포넌트에서는 storeId만 필요하므로 래핑 함수를 만듭니다.
  const handleBookmarkClick = () => {
    onBookmarkToggle?.(store.id);
  };

  const handleLocationClick = () => {
    console.log('위치보기버튼 클릭됨');
  };

  const handlePhoneClick = () => {
    console.log('전화버튼클릭됨');
  };

  // --- 인포윈도우를 위한 compact 모드 ---
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-md shadow-lg p-3 w-56">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-base text-black pr-2 flex-grow">{store.name}</h3>
            <div className="flex-shrink-0 cursor-pointer">
              <BookmarkStar isBookmarked={store.isBookmarked} onToggle={handleBookmarkClick} />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-1">{store.address}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TimeIcon className="w-3 h-3" />
            <span>{store.hours}</span>
          </div>
        </div>
      </div>
    );
  }

  // --- 기존 'full' 모드 렌더링 ---
  const bgColor = isDarkMode ? 'bg-[#251A49]' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const subTextColor = isDarkMode ? 'text-gray-300' : 'text-gray-400';
  const IconLocation = isDarkMode ? LocationWhiteIcon : LocationIcon;
  const IconTime = isDarkMode ? TimeWhiteIcon : TimeIcon;

  return (
    <div
      className={`relative w-[353px] h-[159px] rounded-[8px] shadow-[0px_2px_10px_rgba(0,0,0,0.25)] transition-all duration-300 pl-[19px] pr-[15px] pt-[19px] ${bgColor} ${className}`}
    >
      <div className="absolute left-[19px] top-[19px]">
        <StoreTypeIcon
          category={store.category}
          storeClass={store.storeClass}
          event={store.event}
          size={50}
        />
      </div>
      <div className="absolute right-[15px] top-[14px]">
        <BookmarkStar isBookmarked={store.isBookmarked} onToggle={handleBookmarkClick} />
      </div>
      <div className="absolute left-[85px] top-[19px]">
        <h3 className={`font-semibold text-lm ${textColor}`}>{store.name}</h3>
      </div>
      <div className="absolute left-[85px] top-[46px]">
        <p className={`font-regular text-sm ${subTextColor} leading-[19px]`}>{store.address}</p>
      </div>
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
