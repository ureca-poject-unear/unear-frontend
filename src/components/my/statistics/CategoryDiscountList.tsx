import CategoryDiscountCard from '@/components/common/CategoryDiscountCard';
import BackIcon from '@/assets/common/backIcon.svg?react';
import type { CalculatedCategoryData } from '@/hooks/my/statistics';

// 더보기 애니메이션
import './animations.css';

interface CategoryDiscountListProps {
  calculatedCategoryData: CalculatedCategoryData[];
  currentMonth: number;
  showAllCategories: boolean;
  onToggleCategories: () => void;
  onCardClick: (category: string, percentage: number, categoryName: string) => void;
  shouldBeTransparent: (category: string) => boolean;
}

const CategoryDiscountList = ({
  calculatedCategoryData,
  currentMonth,
  showAllCategories,
  onToggleCategories,
  onCardClick,
  shouldBeTransparent,
}: CategoryDiscountListProps) => {
  const handleCardClick = (item: CalculatedCategoryData) => {
    onCardClick(item.category, item.discountPercentage, item.categoryName);
  };

  return (
    <div className="bg-white">
      <div className="px-5">
        <div className="space-y-3 mb-2">
          {calculatedCategoryData.length > 0 ? (
            <>
              {/* 처음 3개 카테고리 (항상 표시) */}
              {calculatedCategoryData.slice(0, 3).map((item, index) => (
                <div
                  key={`${currentMonth}-${index}`}
                  className={`transform transition-all duration-300 ease-out cursor-pointer ${
                    shouldBeTransparent(item.category) ? 'opacity-50' : 'opacity-100'
                  }`}
                  onClick={() => handleCardClick(item)}
                >
                  <CategoryDiscountCard
                    category={item.category}
                    categoryName={item.categoryName}
                    discountPercentage={item.discountPercentage}
                    discountAmount={item.discountAmount}
                    className="mx-auto rounded-lg hover:shadow-md transition-shadow duration-200"
                  />
                </div>
              ))}

              {/* 4번째 이후 카테고리 (더보기용) */}
              {calculatedCategoryData.length > 3 && (
                <div
                  className={`
                    space-y-3 
                    ${showAllCategories ? 'expand-height' : 'collapse-height'}
                  `}
                >
                  {calculatedCategoryData.slice(3).map((item, index) => (
                    <div
                      key={`${currentMonth}-extra-${index}`}
                      className={`transform transition-all duration-300 ease-out cursor-pointer ${
                        shouldBeTransparent(item.category) ? 'opacity-50' : 'opacity-100'
                      }`}
                      style={{
                        transitionDelay: showAllCategories ? `${index * 100}ms` : '0ms',
                      }}
                      onClick={() => handleCardClick(item)}
                    >
                      <CategoryDiscountCard
                        category={item.category}
                        categoryName={item.categoryName}
                        discountPercentage={item.discountPercentage}
                        discountAmount={item.discountAmount}
                        className="mx-auto rounded-lg hover:shadow-md transition-shadow duration-200"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">할인 내역이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 더보기 버튼 */}
        {calculatedCategoryData.length > 3 && (
          <div className="flex items-center justify-center pb-4">
            <button
              className="flex items-center transition-all duration-300 ease-out hover:scale-105"
              onClick={onToggleCategories}
            >
              <span className="text-m font-semibold text-black mr-2">
                {showAllCategories ? '접기' : '더보기'}
              </span>
              <BackIcon
                className={`
                  w-5 h-5 transform transition-transform duration-300 ease-out
                  ${showAllCategories ? '-rotate-90 mb-2' : 'rotate-90 '}
                `}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDiscountList;
