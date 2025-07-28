import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBenefits from '@/hooks/membership/useBenefits';
import Header from '@/components/common/Header';
import SearchBar from '@/components/common/SearchBar';
import CategoryFilter from '@/components/membership/CategoryFilter';
import MembershipCard from '@/components/common/MembershipCard';
import type { BenefitItem } from '@/types/benefit';

export default function MembershipPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const navigate = useNavigate();

  // selectedCategory를 categoryCode로 useBenefits 호출
  const {
    data: benefitsList,
    isLoading,
    isError,
  } = useBenefits(selectedCategory === '전체' ? undefined : selectedCategory);

  if (isLoading) {
    return <div className="text-sm text-center mt-10">불러오는 중입니다...</div>;
  }

  if (isError || !benefitsList) {
    return (
      <div className="text-sm text-center mt-10 text-red-500">데이터를 불러오지 못했습니다.</div>
    );
  }

  // API 응답이 BenefitItem[] 이므로 바로 사용 가능
  // 클라이언트 필터링은 필요 없지만, 혹시 검색바와 함께 쓰려면 여기에 추가 가능

  return (
    <div className="w-full max-w-[393px] bg-background">
      <Header title="혜택 안내" />

      <div className="mt-4 px-5">
        <SearchBar />
      </div>

      <div className="bg-white mt-4">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => setSelectedCategory(category)}
        />

        <div className="text-sm text-black font-semibold px-5 my-2.5">
          총 <span className="text-primary font-semibold">{benefitsList.length}개</span>
        </div>

        <div className="flex flex-col gap-3 items-center pb-5">
          {benefitsList.map((item: BenefitItem) => (
            <MembershipCard
              key={item.franchiseId}
              name={item.franchiseName}
              description={''} // API에 description 필드 없으므로 빈 문자열 또는 다른 데이터 연결 필요
              grade={item.hasVvip ? 'VVIP' : item.hasVip ? 'VIP' : item.hasBasic ? '우수' : '우수'}
              imageUrl={item.franchiseImageUrl}
              onClick={() =>
                navigate(`/membership/detail/${item.franchiseId}`, {
                  state: { benefitId: item.franchiseId },
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
