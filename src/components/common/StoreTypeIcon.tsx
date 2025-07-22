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
export type CategoryType =
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

// 모드 타입 정의
type ModeType = 'store' | 'statistics';

// 모양 타입 정의
type ShapeType = 'square' | 'circle';

// Props 인터페이스 정의
interface StoreTypeIconProps {
  category: CategoryType;
  storeClass: StoreClassType;
  size?: number;
  className?: string;
  mode?: ModeType;
  shape?: ShapeType;
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

const StoreTypeIcon: React.FC<StoreTypeIconProps> = ({
  category,
  storeClass,
  size = 50,
  className = '',
  mode = 'store',
  shape = 'square',
}) => {
  // 매장 모드 색상 클래스 반환
  const getStoreColorClass = (): string => {
    switch (storeClass) {
      case 'franchise':
        return 'text-orange-500';
      case 'small-business':
        return 'text-blue-500';
      case 'event':
        return 'text-primary';
      default:
        return 'text-black';
    }
  };

  // 통계 모드 색상 클래스 반환
  const getStatisticsColorClass = (): string => {
    switch (category) {
      case 'cafe':
        return 'text-amber-700';
      case 'food':
        return 'text-red-500';
      case 'shopping':
        return 'text-blue-500';
      case 'education':
        return 'text-green-500';
      case 'culture':
        return 'text-violet-500';
      case 'bakery':
        return 'text-orange-500';
      case 'beauty':
        return 'text-pink-500';
      case 'convenience':
        return 'text-gray-500';
      case 'activity':
        return 'text-teal-500';
      case 'popup':
        return 'text-fuchsia-500';
      default:
        return 'text-black';
    }
  };

  // 모드에 따른 색상 클래스 반환
  const getColorClass = (): string => {
    return mode === 'store' ? getStoreColorClass() : getStatisticsColorClass();
  };

  // 모양에 따른 border radius 클래스 반환
  const getShapeClass = (): string => {
    return shape === 'circle' ? 'rounded-full' : 'rounded-lg';
  };

  const IconComponent = categoryIconMap[category];
  const colorClass = getColorClass();
  const shapeClass = getShapeClass();

  return (
    <div
      className={`flex items-center justify-center bg-gray-100 ${shapeClass} ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <div className={`w-[18px] h-[18px] flex items-center justify-center ${colorClass}`}>
        <IconComponent
          width={18}
          height={18}
          className={`w-full h-full ${
            category === 'activity' ? 'fill-none stroke-current stroke-[1.2]' : 'fill-current'
          }`}
        />
      </div>
    </div>
  );
};

export default StoreTypeIcon;

/*
사용법

기본 사용법 (매장 모드, 네모 모양):
<StoreTypeIcon category="cafe" storeClass="franchise" />

원형 모양:
<StoreTypeIcon category="cafe" storeClass="franchise" shape="circle" />

통계 모드 (카테고리별 색상):
<StoreTypeIcon category="cafe" storeClass="franchise" mode="statistics" />

통계 모드 + 원형:
<StoreTypeIcon category="cafe" storeClass="franchise" mode="statistics" shape="circle" />

Props:
- category: 카테고리 (cafe, food, shopping, education, culture, bakery, beauty, convenience, activity, popup)
- storeClass: 매장 구분 (franchise, small-business, event) - store 모드에서만 사용
- size: 크기 (기본값: 50)
- className: 추가 CSS 클래스
- mode: 색상 모드 (store, statistics) - 기본값: store
- shape: 모양 (square, circle) - 기본값: square
*/
