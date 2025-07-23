import type { CalculatedCategoryData, ProgressBar } from './types';

export const useProgressBars = () => {
  // 카테고리별 색상 매핑
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'cafe': return 'bg-amber-700';
      case 'food': return 'bg-red-500';
      case 'shopping': return 'bg-blue-500';
      case 'education': return 'bg-green-500';
      case 'culture': return 'bg-violet-500';
      case 'bakery': return 'bg-orange-500';
      case 'beauty': return 'bg-pink-500';
      case 'convenience': return 'bg-gray-500';
      case 'activity': return 'bg-teal-500';
      case 'popup': return 'bg-fuchsia-500';
      default: return 'bg-gray-400';
    }
  };

  // 진행률 바 생성
  const generateProgressBars = (
    calculatedCategoryData: CalculatedCategoryData[],
    totalDiscountAmount: number
  ): ProgressBar[] => {
    if (totalDiscountAmount === 0) return [];

    return calculatedCategoryData.map((item, index) => {
      const exactPercentage = (item.discountAmount / totalDiscountAmount) * 100;
      const colorClass = getCategoryColor(item.category);
      const isFirst = index === 0;
      const isLast = index === calculatedCategoryData.length - 1;

      return {
        category: item.category,
        categoryName: item.categoryName,
        percentage: exactPercentage,
        displayPercentage: item.discountPercentage,
        colorClass: colorClass,
        roundedClass:
          isFirst && isLast
            ? 'rounded-full'
            : isFirst
              ? 'rounded-l-full'
              : isLast
                ? 'rounded-r-full'
                : '',
      };
    });
  };

  return {
    getCategoryColor,
    generateProgressBars,
  };
};