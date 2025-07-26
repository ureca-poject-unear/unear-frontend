import useStatisticsChart from '@/hooks/my/useStatisticsChart';
import type { ChartDataItem } from '@/types/myPage';

interface StatisticsChartProps {
  chartData: ChartDataItem[];
  className?: string;
}

const StatisticsChart = ({ chartData, className = '' }: StatisticsChartProps) => {
  const { calculateBarHeight } = useStatisticsChart({ chartData });

  const renderChartBar = (item: ChartDataItem, index: number) => {
    const { month, value, highlight } = item;
    const barHeight = Math.max(calculateBarHeight(value), 4);

    return (
      <div key={index} className="flex flex-col items-center gap-1 w-[50px]">
        {/* 값 표시 */}
        <span className={`text-m font-semibold ${highlight ? 'text-primary' : 'text-black'}`}>
          {value}
        </span>

        {/* 바 차트 */}
        <div
          className="rounded-t-lg w-8"
          style={{
            height: `${barHeight}px`,
            backgroundColor: highlight ? '#E6007E' : '#6B7280', // primary, gray-500 색상을 직접 지정
          }}
        />

        {/* 월 표시 */}
        <span className="text-m font-semibold text-black">{month}</span>
      </div>
    );
  };

  return (
    <div className={`flex justify-between items-end h-[160px] ${className}`}>
      {chartData.map(renderChartBar)}
    </div>
  );
};

export default StatisticsChart;
