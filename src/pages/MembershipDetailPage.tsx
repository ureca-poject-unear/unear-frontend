import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getBenefitDetail } from '@/apis/getBenefitDetail';
import type { MembershipPolicy, BenefitDetailResponse } from '@/types/benefitDetail';

export default function MembershipDetailPage() {
  const { franchiseId: paramFranchiseId } = useParams<{ franchiseId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // 👉 franchiseId를 state 또는 param에서 안전하게 파싱
  const franchiseId =
    location.state?.franchiseId ?? (paramFranchiseId ? Number(paramFranchiseId) : null);

  const [benefitData, setBenefitData] = useState<BenefitDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!franchiseId) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getBenefitDetail(franchiseId);
        setBenefitData(res);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [franchiseId]);

  if (isLoading) {
    return <div className="text-center mt-10 text-m">불러오는 중입니다...</div>;
  }

  if (isError || !benefitData) {
    return (
      <div className="text-center mt-10 text-m text-red-500">데이터를 불러올 수 없습니다.</div>
    );
  }

  const hasPolicies =
    Array.isArray(benefitData.membershipPolicies) && benefitData.membershipPolicies.length > 0;

  return (
    <div className="w-full max-w-[393px] min-h-screen bg-background px-5 mx-auto">
      <div className="w-full flex items-center gap-2 py-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-lg font-semibold text-black">{benefitData.franchiseName}</h1>
      </div>

      <img
        src={benefitData.imageUrl || '/assets/common/default.png'}
        alt={benefitData.franchiseName}
        className="w-full h-40 object-cover rounded-2xl mb-4"
      />

      {hasPolicies && (
        <div className="mb-6">
          <h2 className="text-m font-bold mb-2 text-black">등급별 혜택</h2>
          <ul className="text-sm text-black list-disc pl-5 space-y-1">
            {benefitData.membershipPolicies.map((policy: MembershipPolicy, idx: number) => (
              <li key={idx}>
                <span className="font-semibold">{policy.membershipCode}:</span>{' '}
                {policy.fixedDiscount
                  ? `${policy.fixedDiscount.toLocaleString()}원 할인`
                  : policy.discountPercent
                    ? `${policy.discountPercent}% 할인`
                    : '혜택 없음'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
