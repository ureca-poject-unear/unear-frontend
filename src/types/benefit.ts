export type GradeType = 'VIP' | 'VVIP' | '우수';

export interface BenefitItem {
  franchiseId: number;
  franchiseName: string;
  franchiseImageUrl: string;
  categoryCode: string;
  hasVvip: boolean;
  hasVip: boolean;
  hasBasic: boolean;
}
