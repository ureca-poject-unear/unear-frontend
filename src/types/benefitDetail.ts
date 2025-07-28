export type GradeType = 'VIP' | 'VVIP' | '우수';

export interface MembershipPolicy {
  membershipCode: 'BASIC' | 'VIP' | 'VVIP';
  discountCode: string;
  unitBaseAmount: number | null;
  fixedDiscount: number | null;
  discountPercent: number | null;
  minPurchaseAmount: number | null;
  maxDiscountAmount: number | null;
}

export interface BenefitDetail {
  franchiseId: number;
  franchiseName: string;
  imageUrl: string;
  categoryCode: string;
  membershipPolicies?: MembershipPolicy[];
}
