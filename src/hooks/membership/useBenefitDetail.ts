import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { BenefitDetail } from '@/types/benefitDetail';

interface BenefitDetailResponse {
  resultCode: number;
  codeName: string;
  message: string;
  data: BenefitDetail;
}

const fetchBenefitDetail = async (franchiseId: number): Promise<BenefitDetail> => {
  const { data } = await axios.get<BenefitDetailResponse>(
    `https://dev.unear.site/api/app/benefits/franchise/${franchiseId}`
  );
  return data.data;
};

const useBenefitDetail = (franchiseId: number) => {
  return useQuery<BenefitDetail>({
    queryKey: ['benefitDetail', franchiseId],
    queryFn: () => fetchBenefitDetail(franchiseId),
    enabled: !!franchiseId,
  });
};

export default useBenefitDetail;
