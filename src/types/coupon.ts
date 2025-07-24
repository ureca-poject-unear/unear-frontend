// 리스트 API에서 받아오는 쿠폰
export interface UserCoupon {
  userCouponId: number;
  couponName: string;
  barcodeNumber: string;
  couponStatusCode: 'UNUSED' | 'USED' | 'EXPIRED';
  createdAt: string;
  couponEnd: string;
  name: string; // 브랜드명
  imageUrl?: string | null;
  categoryCode:
    | 'CAFE'
    | 'FOOD'
    | 'SHOPPING'
    | 'EDUCATION'
    | 'CULTURE'
    | 'BAKERY'
    | 'BEAUTY'
    | 'LIFE'
    | 'ACTIVITY'
    | 'POPUP';
  markerCode: 'FRANCHISE' | 'LOCAL' | 'BASIC';
}

// 상세 API에서 받아오는 쿠폰 상세 정보
export interface UserCouponDetail {
  userCouponId: number;
  couponName: string;
  barcodeNumber: string;
  couponStatusCode: 'UNUSED' | 'USED' | 'EXPIRED';
  createdAt: string;
  couponEnd: string;
  discountCode: 'COUPON_PERCENT' | 'COUPON_FIXED';
  membershipCode: string;
  unitBaseAmount?: number | null;
  fixedDiscount?: number | null;
  discountPercent?: number | null;
  minPurchaseAmount?: number | null;
  maxDiscountAmount?: number | null;
  markerCode: 'FRANCHISE' | 'LOCAL' | 'BASIC';
}
