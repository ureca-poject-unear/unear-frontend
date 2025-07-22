import CoffeeIcon from '@/assets/common/coffee.svg?react';
import FoodIcon from '@/assets/common/food.svg?react';
import ShoppingIcon from '@/assets/common/shopping.svg?react';
import BookIcon from '@/assets/common/book.svg?react';
import CultureIcon from '@/assets/common/culture.svg?react';
import BreadIcon from '@/assets/common/bread.svg?react';
import BeautyIcon from '@/assets/common/beauty.svg?react';
import LifeIcon from '@/assets/common/life.svg?react';
import ActivityIcon from '@/assets/common/activity.svg?react';
import StoreIcon from '@/assets/common/store.svg?react';

// 카테고리 타입 정의
type CategoryType =
  | 'cafe'
  | 'food'
  | 'shopping'
  | 'education'
  | 'culture'
  | 'bakery'
  | 'beauty'
  | 'convenience'
  | 'activity'
  | 'popup';

// 구분 타입 정의
type StoreClassType = 'franchise' | 'small-business' | 'event';

// Props 인터페이스 정의
interface MapMarkerIconProps {
  category: CategoryType;
  storeClass: StoreClassType;
  isEssential?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

// 카테고리별 아이콘 컴포넌트 매핑
const categoryIconMap: Record<CategoryType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  cafe: CoffeeIcon,
  food: FoodIcon,
  shopping: ShoppingIcon,
  education: BookIcon,
  culture: CultureIcon,
  bakery: BreadIcon,
  beauty: BeautyIcon,
  convenience: LifeIcon,
  activity: ActivityIcon,
  popup: StoreIcon,
};

const MapMarkerIcon: React.FC<MapMarkerIconProps> = ({
  category,
  storeClass,
  isEssential = false,
  isSelected = false,
  onClick,
  className = '',
}) => {
  // 매장 구분별 배경 색상 클래스 반환
  const getBackgroundColorClass = (): string => {
    if (isEssential) {
      return 'bg-pink-400';
    }

    switch (storeClass) {
      case 'franchise':
        return 'bg-orange-500';
      case 'small-business':
        return 'bg-blue-500';
      case 'event':
        return 'bg-primary';
      default:
        return 'bg-gray-500';
    }
  };

  // 크기와 아이콘 색상 계산
  const getSize = () => {
    if (isEssential) {
      return isSelected ? { container: 42, icon: 18 } : { container: 35, icon: 15 };
    }
    return isSelected ? { container: 30, icon: 13 } : { container: 25, icon: 11 };
  };

  const getIconColorClass = (): string => {
    return isSelected ? 'text-black' : 'text-white';
  };

  const IconComponent = categoryIconMap[category];
  const backgroundColorClass = getBackgroundColorClass();
  const iconColorClass = getIconColorClass();
  const size = getSize();

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center
        rounded-full
        transition-all duration-300 ease-in-out
        transform
        hover:scale-105
        active:scale-95
        cursor-pointer
        shadow-lg
        ${backgroundColorClass}
        ${className}
      `}
      style={{
        width: size.container,
        height: size.container,
      }}
    >
      <div
        className={`flex items-center justify-center ${iconColorClass} transition-all duration-300 ${
          category === 'cafe' ? 'transform translate-x-[5%]' : ''
        }`}
        style={{
          width: size.icon,
          height: size.icon,
        }}
      >
        <IconComponent
          width={size.icon}
          height={size.icon}
          className={`w-full h-full transition-all duration-300 ${
            category === 'activity' ? 'fill-none stroke-current stroke-[1.2]' : 'fill-current'
          }`}
        />
      </div>
    </button>
  );
};

export default MapMarkerIcon;

/*
사용법:

기본 마커 (프랜차이즈 카페):
<MapMarkerIcon category="cafe" storeClass="franchise" />

사용하는 페이지에서 선택효과 얻으려면 다음과 같이 상태관리 필요
const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const handleMarkerClick = (markerId: string) => {
    // 이미 선택된 마커를 다시 클릭하면 선택 해제, 아니면 선택
    setSelectedMarkerId(selectedMarkerId === markerId ? null : markerId);
  };

제어되는 마커 (상위에서 선택 상태 관리):
<MapMarkerIcon 
  category="food" 
  storeClass="small-business" 
  isSelected={selectedId === 'marker1'}
  onClick={() => setSelectedId('marker1')} 
/>

필수 매장 마커:
<MapMarkerIcon 
  category="beauty" 
  storeClass="event" 
  isEssential={true}
  isSelected={selectedId === 'essential1'}
  onClick={() => setSelectedId('essential1')} 
/>

Props:
- category: 카테고리 (cafe, food, shopping, education, culture, bakery, beauty, convenience, activity, popup)
- storeClass: 매장 구분 (franchise, small-business, event) - 배경 색상 결정
- isEssential: 필수 매장 여부 (기본값: false) - 크기와 색상에 영향
- isSelected: 선택 상태 (기본값: false) - 크기와 아이콘 색상에 영향
- onClick: 클릭 이벤트 핸들러
- className: 추가 CSS 클래스

특징:
- 상위 컴포넌트에서 선택 상태를 제어할 수 있음
- 부드러운 애니메이션 효과 (300ms 전환)
- 호버 및 클릭 피드백 효과
*/
