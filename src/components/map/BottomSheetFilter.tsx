import BottomSheet from '@/components/common/BottomSheet';
import FilterButton from '@/components/common/FilterButton';
import MiniButton from '@/components/common/MiniButton';
import { useState } from 'react';

interface BottomSheetFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function BottomSheetFilter({ isOpen, onClose }: BottomSheetFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['전체']);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(['전체']);

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
    console.log('적용할 업종:', selectedCategories);
    console.log('적용할 혜택:', selectedBenefits);
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
