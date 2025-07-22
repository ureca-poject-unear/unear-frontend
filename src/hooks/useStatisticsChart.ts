import { useMemo } from 'react';

export interface ChartDataItem {
  month: string;
  value: number;
  highlight?: boolean;
}

interface UseStatisticsChartReturn {
  chartData: ChartDataItem[];
  maxValue: number;
  chartHeight: number;
  calculateBarHeight: (value: number) => number;
}

const useStatisticsChart = (): UseStatisticsChartReturn => {
  // 차트 데이터 (실제로는 API에서 받아올 데이터)
  const chartData: ChartDataItem[] = useMemo(
    () => [
      { month: '3월', value: 0 },
      { month: '4월', value: 30 },
      { month: '5월', value: 28 },
      { month: '6월', value: 42 },
      { month: '7월', value: 21, highlight: true },
    ],
    []
  );

  // 차트 설정값
  const chartHeight = 120; // 차트 영역 최대 높이

  // 최댓값 계산
  const maxValue = useMemo(() => {
    return Math.max(...chartData.map((item) => item.value));
  }, [chartData]);

  // 바 높이 계산 함수
  const calculateBarHeight = useMemo(() => {
    return (value: number): number => {
      return maxValue > 0 ? (value / maxValue) * chartHeight : 4;
    };
  }, [maxValue, chartHeight]);

  return {
    chartData,
    maxValue,
    chartHeight,
    calculateBarHeight,
  };
};

export default useStatisticsChart;
