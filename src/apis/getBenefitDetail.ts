import axios from 'axios';

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

const fetchBenefitDetail = async (franchiseId: number): Promise<BenefitDetail> => {
  const { data } = await axios.get(`/benefits/franchise/${franchiseId}`); // API 경로에 franchiseId 사용
  return data.data;
};

export default fetchBenefitDetail;
