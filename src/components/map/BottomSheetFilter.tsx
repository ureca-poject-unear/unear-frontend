import { useEffect, useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import FilterButton from '@/components/common/FilterButton';
import MiniButton from '@/components/common/MiniButton';

interface BottomSheetFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (categoryCode: string | null, benefitCategory: string | null) => void;
  selectedCategoryCode: string | null;
  selectedBenefitCategory: string | null;
}

const reverseCategoryCode = (code: string | null): string => {
  const map: Record<string, string> = {
    CAFE: '카페',
    FOOD: '푸드',
    SHOPPING: '쇼핑',
    EDUCATION: '교육',
    CULTURE: '문화/여가',
    BAKERY: '베이커리',
    BEAUTY: '뷰티/건강',
    LIFE: '생활/편의',
    ACTIVITY: '액티비티',
  };
  return code && map[code] ? map[code] : '전체';
};

const mapCategoryCode = (name: string): string | null => {
  const map: Record<string, string> = {
    카페: 'CAFE',
    푸드: 'FOOD',
    쇼핑: 'SHOPPING',
    교육: 'EDUCATION',
    '문화/여가': 'CULTURE',
    베이커리: 'BAKERY',
    '뷰티/건강': 'BEAUTY',
    '생활/편의': 'LIFE',
    액티비티: 'ACTIVITY',
  };
  return name === '전체' ? null : map[name];
};
const CATEGORY_LIST = [
  '전체',
  '카페',
  '푸드',
  '쇼핑',
  '교육',
  '문화/여가',
  '베이커리',
  '뷰티/건강',
  '생활/편의',
  '액티비티',
];
const BENEFIT_LIST = ['전체', '할인', '적립', '무료서비스', '상품 증정'];

export default function BottomSheetFilter({
  isOpen,
  onClose,
  onApply,
  selectedCategoryCode,
  selectedBenefitCategory,
}: BottomSheetFilterProps) {
  const initialCategory = reverseCategoryCode(selectedCategoryCode);
  const initialBenefit = selectedBenefitCategory ?? '전체';

  const [selectedCategories, setSelectedCategories] = useState<string[]>([initialCategory]);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([initialBenefit]);
  useEffect(() => {
    if (isOpen) {
      setSelectedCategories([reverseCategoryCode(selectedCategoryCode)]);
      setSelectedBenefits([selectedBenefitCategory ?? '전체']);
    }
  }, [isOpen, selectedCategoryCode, selectedBenefitCategory]);
  const toggleSelection = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (value === '전체') {
      setList(['전체']);
    } else {
      const newList = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list.filter((item) => item !== '전체'), value];

      setList(newList.length > 0 ? newList : ['전체']);
    }
  };

  const isSelected = (value: string, list: string[]) => list.includes(value);

  const handleReset = () => {
    setSelectedCategories(['전체']);
    setSelectedBenefits(['전체']);
  };

  const handleApply = () => {
    const category = mapCategoryCode(selectedCategories[0]);
    const benefit = selectedBenefits.includes('전체') ? null : selectedBenefits[0];
    onApply(category, benefit);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="space-y-8 pt-3">
        {/* 업종 선택 */}
        <section>
          <p className="text-lm font-semibold mb-2.5">업종 선택</p>
          <div className="flex flex-wrap gap-x-[11px] gap-y-2">
            {CATEGORY_LIST.map((item) => (
              <FilterButton
                key={item}
                text={item}
                onClick={() => toggleSelection(item, selectedCategories, setSelectedCategories)}
                isActive={isSelected(item, selectedCategories)}
              />
            ))}
          </div>
        </section>

        {/* 혜택 유형 */}
        <section>
          <p className="text-lm font-semibold mb-2.5">혜택 유형</p>
          <div className="flex flex-wrap gap-x-[11px] gap-y-2">
            {BENEFIT_LIST.map((item) => (
              <FilterButton
                key={item}
                text={item}
                onClick={() => toggleSelection(item, selectedBenefits, setSelectedBenefits)}
                isActive={isSelected(item, selectedBenefits)}
              />
            ))}
          </div>
        </section>

        {/* 버튼 */}
        <div className="flex flex-col items-center gap-3">
          <MiniButton text="필터 적용하기" onClick={handleApply} isActive />
          <button onClick={handleReset} className="text-sm font-semibold text-black underline">
            초기화
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
