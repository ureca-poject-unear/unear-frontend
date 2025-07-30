import BackIcon from '@/assets/common/backIcon.svg?react';
import StatisticsChart from './StatisticsChart';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { StatisticsData } from '@/types/myPage';

interface StatisticsSectionProps extends StatisticsData {
  onDetailClick?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const StatisticsSection = ({
  accumulatedSavings,
  chartData,
  onDetailClick,
  isLoading = false,
  error = null,
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
      <div className="px-5 py-5">
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

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex justify-center items-center mt-7 h-[160px]">
            <LoadingSpinner size="md" />
          </div>
        )}

        {/* 에러 상태 */}
        {error && !isLoading && (
          <div className="flex justify-center items-center mt-7 h-[160px]">
            <p className="text-sm text-gray-500">통계 데이터를 불러올 수 없습니다.</p>
          </div>
        )}

        {/* 바 차트 */}
        {!isLoading && !error && <StatisticsChart chartData={chartData} className="mt-7" />}
      </div>
    </div>
  );
};

export default StatisticsSection;
