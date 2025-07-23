import type { CalculatedMonthSummary } from '@/hooks/my/statistics';
import MoneyIcon from '@/assets/my/money.svg?react';
import DiscountIcon from '@/assets/my/discount.svg?react';

interface UsageDiscountSummaryProps {
  calculatedSummary: CalculatedMonthSummary;
  totalDiscountAmount: number;
  formatCurrency: (amount: number) => string;
  formatGrowth: (growth: number) => string;
}

const UsageDiscountSummary = ({
  calculatedSummary,
  totalDiscountAmount,
  formatCurrency,
  formatGrowth,
}: UsageDiscountSummaryProps) => {
  return (
    <div className="bg-white mt-3">
      <div className="px-5 py-5">
        <div className="grid grid-cols-2 gap-4">
          {/* 사용금액 */}
          <div className="bg-gray-100 rounded-lg h-[150px] flex flex-col items-center justify-center relative">
            <div className="absolute -top-3 w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center shadow-sm">
              <MoneyIcon className="w-6 h-6" />
            </div>
            <div className="mt-6">
              <p className="text-s text-gray-500 mb-1 text-center">사용금액</p>
              <p className="text-lm font-semibold text-black mb-2 text-center">
                {formatCurrency(calculatedSummary.usageAmount)}
              </p>
              <p className="text-s text-gray-500 text-center">{formatGrowth(calculatedSummary.usageGrowth)}</p>
            </div>
          </div>

          {/* 할인금액 */}
          <div className="bg-gray-100 rounded-lg h-[150px] flex flex-col items-center justify-center relative">
            <div className="absolute -top-3 w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center shadow-sm">
              <DiscountIcon className="w-6 h-6" />
            </div>
            <div className="mt-6">
              <p className="text-s text-gray-500 mb-1 text-center">할인금액</p>
              <p className="text-lm font-semibold text-black mb-2 text-center">
                {formatCurrency(totalDiscountAmount)}
              </p>
              <p className="text-s text-gray-500 text-center">{formatGrowth(calculatedSummary.discountGrowth)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageDiscountSummary;
