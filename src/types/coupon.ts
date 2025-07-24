// 쿠폰 관련 타입 정의
export interface CouponItem {
  id: string;
  brand: string;
  title: string;
  discountRate: string;
  validUntil: string;
  category: CategoryType;
  storeClass: StoreClassType;
  barcodeValue: string;
  usageCondition: string;
  usageGuide: string[];
  caution: string[];
  isExpiringSoon?: boolean;
}

export interface CouponData {
  expiringSoonCoupons: CouponItem[];
  allCoupons: CouponItem[];
  totalCount: number;
}

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

export interface CouponPageHandlers {
  onCouponClick: (coupon: CouponItem) => void;
  onBack: () => void;
}
