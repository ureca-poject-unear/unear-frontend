// 기본 쿠폰 카테고리 및 스토어 타입
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

// 기본 쿠폰 아이템 (기존 정의 유지)
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

// 사용자 쿠폰 (목록용) - CouponItem 확장
export interface UserCoupon extends CouponItem {
  userCouponId: number;
  couponId: number;
  userId: number;
  validFrom: string;
  isUsed: boolean;
  isExpired: boolean;
  usedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 사용자 쿠폰 상세 정보 - UserCoupon 확장
export interface UserCouponDetail extends UserCoupon {
  description?: string;
  discountAmount?: number;
  minimumAmount?: number;
  barcodeType?: string;
  storeInfo?: {
    storeName: string;
    storeAddress?: string;
    storePhone?: string;
  };
  discountCode: 'COUPON_PERCENT' | 'COUPON_FIXED';
  discountPercent?: number;
  fixedDiscount?: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
}

// 쿠폰 데이터 (여러 쿠폰 관리용)
export interface CouponData {
  expiringSoonCoupons: CouponItem[];
  allCoupons: CouponItem[];
  totalCount: number;
}

// 쿠폰 페이지 핸들러
export interface CouponPageHandlers {
  onCouponClick: (coupon: CouponItem) => void;
  onBack: () => void;
}

// 쿠폰 상태 타입
export type CouponStatus = 'AVAILABLE' | 'USED' | 'EXPIRED';

// 쿠폰 사용 요청 타입
export interface UseCouponRequest {
  userCouponId: number;
  storeId?: number;
  usageNote?: string;
}

// 쿠폰 사용 응답 타입
export interface UseCouponResponse {
  success: boolean;
  message: string;
  data: {
    userCouponId: number;
    usedAt: string;
    remainingAmount?: number;
  };
}
