import type { ChartDataItem } from '@/hooks/useStatisticsChart';
import useStatisticsChart from '@/hooks/useStatisticsChart';

interface StatisticsChartProps {
  className?: string;
}

const StatisticsChart = ({ className = '' }: StatisticsChartProps) => {
  const { chartData, calculateBarHeight } = useStatisticsChart();

  const renderChartBar = (item: ChartDataItem, index: number) => {
    const { month, value, highlight } = item;
    const barHeight = Math.max(calculateBarHeight(value), 4);

    return (
      <div key={index} className="flex flex-col items-center gap-2 w-[50px]">
        {/* 값 표시 */}
        <span className={`text-m font-semibold ${highlight ? 'text-primary' : 'text-black'}`}>
          {value}
        </span>

        {/* 바 차트 */}
        <div
          className={`rounded-t-lg w-8 ${highlight ? 'bg-primary' : 'bg-gray-500'}`}
          style={{ height: `${barHeight}px` }}
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
