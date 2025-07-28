import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { BenefitItem } from '@/types/benefit';

interface BenefitListResponse {
  resultCode: number;
  codeName: string;
  message: string;
  data: {
    content: BenefitItem[];
  };
}

const fetchBenefits = async (categoryCode?: string): Promise<BenefitItem[]> => {
  const params = categoryCode && categoryCode !== '전체' ? { categoryCode } : {};
  const { data } = await axios.get<BenefitListResponse>(
    'https://dev.unear.site/api/app/benefits/franchise',
    { params }
  );
  return data.data.content;
};

const useBenefits = (categoryCode?: string) => {
  return useQuery<BenefitItem[]>({
    queryKey: ['benefits', categoryCode],
    queryFn: () => fetchBenefits(categoryCode),
  });
};

export default useBenefits;
