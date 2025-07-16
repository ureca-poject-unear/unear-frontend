import React from 'react';

// SVG 파일들을 React 컴포넌트로 import
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
interface StoreTypeIconProps {
  category: CategoryType;
  storeClass: StoreClassType;
  size?: number;
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

const StoreTypeIcon: React.FC<StoreTypeIconProps> = ({
  category,
  storeClass,
  size = 50,
  className = '',
}) => {
  // Tailwind 색상 클래스 반환
  const getColorClass = (): string => {
    switch (storeClass) {
      case 'franchise':
        return 'text-orange-500'; // Tailwind 기본 색상
      case 'small-business':
        return 'text-blue-500'; // Tailwind 기본 색상
      case 'event':
        return 'text-primary'; // 이미 정의된 커스텀 색상
      default:
        return 'text-black'; // 이미 정의된 커스텀 색상
    }
  };

  const IconComponent = categoryIconMap[category];
  const colorClass = getColorClass();

  return (
    <div
      className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <div className={`w-[20px] h-[20px] flex items-center justify-center ${colorClass}`}>
        <IconComponent
          width={20}
          height={20}
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
            
카테고리 = cafe, food, shopping, education, culture, bakery, beauty, convenience, activity, popup
매장유형 = franchise, small-business, event

<StoreTypeIcon category="카테고리" storeClass="매장유형" />
*/
