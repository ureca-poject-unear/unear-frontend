// getBenefits.ts

import axios from 'axios';
import type { BenefitItem } from '@/types/benefit';
import type { BenefitDetail } from '@/types/benefitDetail';

interface BenefitListResponse {
  resultCode: number;
  codeName: string;
  message: string;
  data: {
    content: BenefitItem[];
  };
}

interface BenefitDetailResponse {
  resultCode: number;
  codeName: string;
  message: string;
  data: BenefitDetail;
}

// 혜택 목록 조회 함수
export const getBenefits = async (categoryCode?: string): Promise<BenefitItem[]> => {
  const params = categoryCode && categoryCode !== '전체' ? { categoryCode } : {};
  const { data } = await axios.get<BenefitListResponse>(
    'https://dev.unear.site/api/app/benefits/franchise',
    { params }
  );
  return data.data.content;
};

// 혜택 상세 조회 함수
export const getBenefitDetail = async (franchiseId: number): Promise<BenefitDetail> => {
  const { data } = await axios.get<BenefitDetailResponse>(
    `https://dev.unear.site/api/app/benefits/franchise/${franchiseId}`
  );
  return data.data;
};
