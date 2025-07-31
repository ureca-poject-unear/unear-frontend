import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import SearchBar from '@/components/common/SearchBar';
import CategoryFilter from '@/components/membership/CategoryFilter';
import MembershipCard from '@/components/common/MembershipCard';
import type { FranchiseBenefitItem, GradeType } from '@/types/franchise';
import { getFranchiseBenefits } from '@/apis/getFranchiseBenefits';

export default function MembershipPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [franchiseList, setFranchiseList] = useState<FranchiseBenefitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFranchiseBenefits = async () => {
      try {
        console.log('📡 [MembershipPage] API 호출 시작');
        const res = await getFranchiseBenefits({ page: 0, size: 100 }); // 전체 조회
        console.log('📝 [MembershipPage] API 응답:', res);
        console.log('📝 [MembershipPage] 첫번째 아이템:', res.content[0]);
        setFranchiseList(res.content);
      } catch (error) {
        console.error('프랜차이즈 혜택 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFranchiseBenefits();
  }, []);

  const filterByCategory = (category: string) => {
    if (category === '전체') return franchiseList;

    // categoryCode -> 한글 매핑
    const categoryMap: Record<string, string> = {
      CAFE: '카페',
      FOOD: '푸드',
      LIFE: '생활/편의',
      BEAUTY: '뷰티',
      CULTURE: '문화/여가',
      BAKERY: '베이커리',
      SHOPPING: '쇼핑',
    };

    return franchiseList.filter((item) => categoryMap[item.categoryCode] === category);
  };

  // 검색 기능 추가
  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);
    if (!keyword.trim()) {
      // 검색어가 없으면 전체 리스트 다시 불러오기
      const res = await getFranchiseBenefits({ page: 0, size: 100 });
      setFranchiseList(res.content);
      return;
    }

    try {
      const res = await getFranchiseBenefits({
        page: 0,
        size: 100,
        franchiseName: keyword,
      });
      setFranchiseList(res.content);
    } catch (error) {
      console.error('검색 실패:', error);
    }
  };

  const filteredList = filterByCategory(selectedCategory);

  return (
    <div className="w-full max-w-[393px] bg-background">
      <Header title="혜택 안내" />

      {/* SearchBar */}
      <div className="mt-4 px-5">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* 필터 + 결과 + 카드 리스트 묶음 */}
      <div className="bg-white mt-4">
        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(category) => setSelectedCategory(category)}
        />

        {/* 결과 개수 */}
        <div className="text-sm text-black font-semibold px-5 my-2.5">
          총 <span className="text-primary font-semibold">{filteredList.length}개</span>
        </div>

        {/* 카드 리스트 */}
        <div className="flex flex-col gap-3 items-center pb-5">
          {loading ? (
            <div className="text-black text-sm">로딩 중...</div>
          ) : filteredList.length > 0 ? (
            filteredList.map((card) => {
              // 타입 에러 방지용 as const 적용
              const gradeList: GradeType[] = [
                ...(card.hasVvip ? (['VVIP'] as const) : []),
                ...(card.hasVip ? (['VIP'] as const) : []),
                ...(card.hasBasic ? (['우수'] as const) : []),
              ];

              return (
                <MembershipCard
                  key={card.franchiseId}
                  name={card.franchiseName}
                  description={card.description || card.franchiseName}
                  grade={gradeList}
                  imageUrl={card.franchiseImageUrl || '/assets/common/default.png'}
                  onClick={() =>
                    navigate(`/membership/detail/${card.franchiseId}`, {
                      state: {
                        franchiseId: card.franchiseId,
                        franchiseName: card.franchiseName,
                        franchiseImageUrl: card.franchiseImageUrl,
                        description: card.description,
                        categoryCode: card.categoryCode,
                        hasVvip: card.hasVvip,
                        hasVip: card.hasVip,
                        hasBasic: card.hasBasic,
                      },
                    })
                  }
                />
              );
            })
          ) : (
            // 검색어가 있고 결과가 없을 때 안내 메시지
            searchKeyword.trim() !== '' && (
              <div className="text-center text-gray-500 py-4">
                "{searchKeyword}" 검색 결과가 없습니다.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
