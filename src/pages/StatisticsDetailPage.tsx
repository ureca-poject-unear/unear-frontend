import { useRef } from 'react';
import Header from '@/components/common/Header';
import {
  StatisticsHeader,
  CategoryDiscountList,
  UsageDiscountSummary,
  MonthlyDiscountChart,
} from '@/components/my/statistics';
import type { StatisticsHeaderRef } from '@/components/my/statistics/StatisticsHeader';
import {
  useStatisticsData,
  useStatisticsCalculations,
  useStatisticsHandlers,
  useProgressBars,
  useCategoryHighlight,
} from '@/hooks/my/statistics';

const StatisticsDetailPage = () => {
  const statisticsHeaderRef = useRef<StatisticsHeaderRef>(null);

  // 데이터 관리
  const {
    currentMonth,
    setCurrentMonth,
    showAllCategories,
    setShowAllCategories,
    currentApiData,
    previousMonthData,
    currentUsageAmount,
    previousUsageAmount,
  } = useStatisticsData();

  // 계산 로직
  const { calculateMonthSummary, calculateCategoryPercentages } = useStatisticsCalculations();

  // 이벤트 핸들러
  const { handlePrevMonth, handleNextMonth, handleBack, handleToggleCategories } =
    useStatisticsHandlers(currentMonth, setCurrentMonth, setShowAllCategories);

  // 진행률 바 관련
  const { generateProgressBars } = useProgressBars();

  // 카테고리 하이라이트 관련
  const { highlightedCategory, highlightCategory, clearHighlight, shouldBeTransparent } =
    useCategoryHighlight();

  // 계산된 데이터들
  const calculatedSummary = calculateMonthSummary(
    currentApiData,
    previousMonthData,
    currentUsageAmount,
    previousUsageAmount
  );
  const totalDiscountAmount = calculatedSummary.discountAmount;
  const calculatedCategoryData = calculateCategoryPercentages(currentApiData.categoryData);
  const progressBars = generateProgressBars(calculatedCategoryData, totalDiscountAmount);

  // 차트 데이터
  const chartData = [
    { month: '3월', value: 0 },
    { month: '4월', value: 6 },
    { month: '5월', value: 5 },
    { month: '6월', value: 1 },
    { month: '7월', value: 2, highlight: true },
  ];

  // 포맷팅 함수
  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('ko-KR')}원`;
  };

  const formatGrowth = (growth: number): string => {
    return `전월 대비 ${growth > 0 ? '+' : ''}${growth}%`;
  };

  // 바 클릭 핸들러 (바에서 직접 클릭)
  const handleBarClick = (
    category: string,
    position: { x: number; y: number },
    percentage: number,
    categoryName: string
  ) => {
    if (highlightedCategory.category === category) {
      clearHighlight();
    } else {
      highlightCategory(category, position, percentage, categoryName);
    }
  };

  // 카드 클릭 핸들러 (카드에서 클릭했지만 바 위치에 툴팁 표시)
  const handleCardClick = (category: string, percentage: number, categoryName: string) => {
    if (highlightedCategory.category === category) {
      clearHighlight();
      return;
    }

    // 바의 위치를 가져와서 툴팁 표시
    const barPosition = statisticsHeaderRef.current?.getBarPosition(category);
    if (barPosition) {
      highlightCategory(category, barPosition, percentage, categoryName);
    }
  };

  // 배경 클릭 시 하이라이트 해제
  const handleBackgroundClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      clearHighlight();
    }
  };

  return (
    <>
      <Header title="개인별 통계" onBack={handleBack} />

      <div className="bg-background min-h-screen relative" onClick={handleBackgroundClick}>
        {/* 헤더 및 진행률 바 섹션 */}
        <StatisticsHeader
          ref={statisticsHeaderRef}
          currentMonth={currentMonth}
          totalDiscountAmount={totalDiscountAmount}
          progressBars={progressBars}
          highlightedCategory={highlightedCategory}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onBarClick={handleBarClick}
          onTooltipClose={clearHighlight}
          formatCurrency={formatCurrency}
        />

        {/* 카테고리별 할인 리스트 */}
        <CategoryDiscountList
          calculatedCategoryData={calculatedCategoryData}
          currentMonth={currentMonth}
          showAllCategories={showAllCategories}
          onToggleCategories={() => handleToggleCategories(showAllCategories)}
          onCardClick={handleCardClick}
          shouldBeTransparent={shouldBeTransparent}
        />

        {/* 사용금액/할인금액 요약 */}
        <UsageDiscountSummary
          calculatedSummary={calculatedSummary}
          totalDiscountAmount={totalDiscountAmount}
          formatCurrency={formatCurrency}
          formatGrowth={formatGrowth}
        />

        {/* 월별 누적 할인액 차트 */}
        <MonthlyDiscountChart chartData={chartData} />
      </div>
    </>
  );
};

export default StatisticsDetailPage;
