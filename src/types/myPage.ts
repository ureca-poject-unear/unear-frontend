// 사용자 관련 타입
export interface UserProfile {
  name: string;
  grade: 'VIP' | 'VVIP' | '우수';
  greeting?: string;
}

// 멤버십 혜택 관련 타입
export interface MembershipBenefit {
  currentMonthSavings: string;
  couponCount: number;
}

// 통계 관련 타입
export interface StatisticsData {
  currentMonthSavings: string;
  accumulatedSavings: string;
  chartData: ChartDataItem[];
}

export interface ChartDataItem {
  month: string;
  value: number;
  highlight?: boolean;
}

// 이용 내역 관련 타입
export interface UsageHistoryItem {
  id: number;
  storeName: string;
  usedDate: string;
  originalPrice: number;
  discountPrice: number;
  category: CategoryType;
  storeClass: StoreClassType;
}

// StoreTypeIcon 관련 타입 (재사용)
export type CategoryType =
  | 'FOOD'
  | 'ACTIVITY'
  | 'EDUCATION'
  | 'CULTURE'
  | 'BAKERY'
  | 'LIFE'
  | 'SHOPPING'
  | 'CAFE'
  | 'BEAUTY'
  | 'POPUP';

export type StoreClassType = 'LOCAL' | 'FRANCHISE' | 'BASIC';

// 액션 핸들러 타입
export interface MyPageHandlers {
  onLogout: () => void;
  onCouponClick: () => void;
  onBookmarkClick: () => void;
  onStatisticsDetail: () => void;
  onUsageHistoryDetail: () => void;
}
