import StatisticsChart from '@/components/my/StatisticsChart';

interface MonthlyDiscountChartProps {
  chartData: Array<{
    month: string;
    value: number;
    highlight?: boolean;
  }>;
}

const MonthlyDiscountChart = ({ chartData }: MonthlyDiscountChartProps) => {
  return (
    <div className="bg-white mt-3">
      <div className="px-5 py-5">
        <h3 className="text-lm font-semibold text-black mb-6">월별 누적 할인액</h3>

        {/* 차트 */}
        <div className="mb-6">
          <StatisticsChart chartData={chartData} />
        </div>

        {/* 범례 */}
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-9">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
              <span className="text-m font-semibold text-black">현재 월</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              <span className="text-m font-semibold text-black">이전 월</span>
            </div>
            <div className="flex items-center">
              <span className="text-m font-semibold text-black">평균: 20만원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyDiscountChart;