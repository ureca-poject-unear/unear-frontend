import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import SearchBar from '@/components/common/SearchBar';
import CategoryFilter from '@/components/membership/CategoryFilter';
import MembershipCard from '@/components/common/MembershipCard';

export type GradeType = 'VIP' | 'VVIP' | '우수';

export type CardItem = {
  name: string;
  description: string;
  grade: GradeType | GradeType[];
  imageUrl: string;
  category: string;
  benefits?: {
    grade: GradeType;
    benefit: string;
  }[];
  usage: string[];
  cautions: string[];
};

// eslint-disable-next-line react-refresh/only-export-components
export const cardList: CardItem[] = [
  {
    name: 'CGV',
    description: 'CGV 전국 매점 및 관람권',
    grade: ['VIP', '우수'],
    imageUrl: '/assets/main/cgv.png',
    category: '문화/여가',
    benefits: [
      { grade: 'VIP', benefit: '구매 금액의 10% 적립' },
      { grade: '우수', benefit: '5% 할인 쿠폰 월 1회 제공' },
    ],
    usage: ['매점에서만 사용 가능합니다.', '관람권 구매 시 추가 적립 가능합니다.'],
    cautions: ['온라인 예매는 제외됩니다.', '일부 매장에서는 혜택이 적용되지 않을 수 있습니다.'],
  },
  {
    name: 'GS25',
    description: '편의점 즉시 할인',
    grade: ['VVIP', 'VIP', '우수'],
    imageUrl: '/assets/main/gs25.png',
    category: '생활/편의',
    benefits: [
      { grade: 'VVIP', benefit: '구매 금액의 10% 적립' },
      { grade: 'VIP', benefit: '5% 할인 쿠폰 월 1회 제공' },
      { grade: '우수', benefit: '5% 할인 쿠폰 월 1회 제공' },
    ],
    usage: [
      '내용 길때 어떨지 보려고 길게길게 쿠폰은 매월 1회 자동 발급됩니다.',
      '편의점 모든 상품에 즉시 할인 적용됩니다.',
      '쿠폰은 매월 1회 자동 발급됩니다.',
    ],
    cautions: ['일부 행사 상품은 제외됩니다.', '타 할인과 중복 적용 불가합니다.'],
  },
  {
    name: '파리바게뜨',
    description:
      '빵, 케이크 교환 가능하며, 매장에서 즉시 사용 가능합니다. 다양한 메뉴를 즐겨보세요.',
    grade: ['VVIP'],
    imageUrl: '/assets/main/parisbaguette.jpg',
    category: '베이커리',
    benefits: [
      { grade: 'VVIP', benefit: '구매 금액의 10% 적립' },
      { grade: 'VIP', benefit: '5% 할인 쿠폰 월 1회 제공' },
    ],
    usage: ['매장에서 즉시 교환 가능합니다.', '케이크 구매 시에도 사용 가능합니다.'],
    cautions: ['온라인 주문에는 적용되지 않습니다.', '특정 시즌 상품은 제외될 수 있습니다.'],
  },
  {
    name: '이마트24',
    description: '편의점 전 상품 구매 가능하며, 일부 행사상품은 제외될 수 있습니다.',
    grade: ['VIP'],
    imageUrl: '/assets/main/emart24.png',
    category: '생활/편의',
    benefits: [
      { grade: 'VVIP', benefit: '구매 금액의 10% 적립' },
      { grade: 'VIP', benefit: '5% 할인 쿠폰 월 1회 제공' },
    ],
    usage: ['전 상품 구매 시 혜택 적용됩니다.', '월 1회 할인 쿠폰 발급됩니다.'],
    cautions: ['일부 행사상품은 제외됩니다.', '타 쿠폰과 중복 사용 불가합니다.'],
  },
  {
    name: '버거킹',
    description: '햄버거, 세트 메뉴 교환 가능하며 일부 매장에서는 사용이 제한될 수 있습니다.',
    grade: ['VVIP'],
    imageUrl: '/assets/main/burgerking.jpg',
    category: '푸드',
    benefits: [
      { grade: 'VVIP', benefit: '구매 금액의 10% 적립' },
      { grade: 'VIP', benefit: '5% 할인 쿠폰 월 1회 제공' },
    ],
    usage: ['세트 메뉴 및 햄버거 구매 시 사용 가능.', '매장 내 즉시 사용 가능합니다.'],
    cautions: ['일부 매장에서는 사용이 제한됩니다.', '프로모션 상품 제외.'],
  },
  {
    name: 'ABC마트',
    description: '운동화, 캐주얼화 등 전 품목 구매 가능. 일부 브랜드는 제외될 수 있습니다.',
    grade: ['VIP', 'VVIP'],
    imageUrl: '/assets/main/abcmart.jpg',
    category: '쇼핑',
    benefits: [
      { grade: 'VVIP', benefit: '구매 금액의 10% 적립' },
      { grade: 'VIP', benefit: '5% 할인 쿠폰 월 1회 제공' },
    ],
    usage: ['전 품목 구매 시 혜택 적용.', '월 1회 할인 쿠폰 제공.'],
    cautions: ['일부 브랜드 제외.', '타 할인과 중복 불가.'],
  },
  {
    name: 'CGV',
    description: '영화 예매 및 매점 이용 가능. 온라인 예매는 불가하며 현장 사용만 가능합니다.',
    grade: ['VVIP'],
    imageUrl: '/assets/main/cgv.png',
    category: '문화/여가',
    benefits: [
      { grade: 'VVIP', benefit: '구매 금액의 10% 적립' },
      { grade: 'VIP', benefit: '5% 할인 쿠폰 월 1회 제공' },
    ],
    usage: ['매점 및 현장 구매 시 사용 가능.', '온라인 예매 제외.'],
    cautions: ['일부 매장 사용 제한.', '프로모션 상품 제외.'],
  },
  {
    name: '스타벅스',
    description: '전 매장에서 사용 가능하며 일부 시즌 메뉴는 제외됩니다. 포인트 적립 불가.',
    grade: ['VIP'],
    imageUrl: '/assets/main/starbucks.jpg',
    category: '카페',
    benefits: [
      { grade: 'VVIP', benefit: '구매 금액의 10% 적립' },
      { grade: 'VIP', benefit: '5% 할인 쿠폰 월 1회 제공' },
    ],
    usage: ['전 매장 사용 가능.', '시즌 메뉴 제외.'],
    cautions: ['포인트 적립 불가.', '타 혜택과 중복 불가.'],
  },
];

export default function MembershipPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredList =
    selectedCategory === '전체'
      ? cardList
      : cardList.filter((item) => item.category === selectedCategory);

  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[393px] bg-background">
      <Header title="혜택 안내" />

      {/* SearchBar */}
      <div className="mt-4 px-5">
        <SearchBar />
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
          {filteredList.map((card) => (
            <MembershipCard
              key={card.name}
              name={card.name}
              description={card.description}
              grade={card.grade}
              imageUrl={card.imageUrl}
              onClick={() => navigate(`/membership/detail/${card.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
