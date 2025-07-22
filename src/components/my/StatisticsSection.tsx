import BackIcon from '@/assets/common/backIcon.svg?react';
import StatisticsChart from './StatisticsChart';

interface StatisticsSectionProps {
  currentMonthSavings: string;
  accumulatedSavings: string;
  onDetailClick?: () => void;
}

const StatisticsSection = ({
  accumulatedSavings = '21만원',
  onDetailClick,
}: StatisticsSectionProps) => {
  const handleDetailClick = () => {
    if (onDetailClick) {
      onDetailClick();
    } else {
      console.log('통계 자세히 보기 클릭');
    }
  };

  return (
    <div className="w-full bg-white mt-3 h-[284px]">
      <div className="px-5 py-6">
        {/* 헤더 */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-lm font-semibold text-black">개인별 통계</span>
            <button type="button" className="flex items-center" onClick={handleDetailClick}>
              <span className="text-m font-semibold text-black">자세히 보기</span>
              <BackIcon className="w-5 h-5 mb-0.5 text-black transform rotate-180" />
            </button>
          </div>
          <p className="text-m font-semibold text-gray-500">
            이번달 누적 할인액 {accumulatedSavings}
          </p>
        </div>

        {/* 바 차트 */}
        <StatisticsChart className="mt-7" />
      </div>
    </div>
  );
};

export default StatisticsSection;
