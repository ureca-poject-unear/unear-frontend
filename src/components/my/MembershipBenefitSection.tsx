import GrowUpIcon from '@/assets/my/growup.svg?react';
import BookmarkButton from '@/components/common/BookmarkButton';
import CouponButton from '@/components/common/CouponBuuton';

interface MembershipBenefitSectionProps {
  currentMonthSavings?: string;
  couponCount?: number;
  onCouponClick?: () => void;
  onBookmarkClick?: () => void;
}

const MembershipBenefitSection = ({
  currentMonthSavings = '21,200원',
  couponCount = 5,
  onCouponClick,
  onBookmarkClick,
}: MembershipBenefitSectionProps) => {
  const handleCouponClick = () => {
    if (onCouponClick) {
      onCouponClick();
    } else {
      console.log('쿠폰 클릭');
    }
  };

  const handleBookmarkClick = () => {
    if (onBookmarkClick) {
      onBookmarkClick();
    } else {
      console.log('즐겨찾기 클릭');
    }
  };

  return (
    <div className="w-full bg-white">
      {/* 멤버십 혜택 영역 */}
      <div className="mx-5 bg-gray-100 rounded-xl">
        <div className="px-5 py-5">
          {/* 멤버십 혜택 헤더 */}
          <div className="flex items-center gap-2 mb-3">
            <GrowUpIcon className="w-6 h-6" />
            <span className="text-m font-regular text-gray-700">멤버십혜택으로</span>
          </div>

          {/* 절약 내역 */}
          <div>
            <span className="text-lm font-semibold text-black">이번달 </span>
            <span className="text-lg font-semibold text-primary">{currentMonthSavings}</span>
            <span className="text-lm font-semibold text-black">을 절약했어요!</span>
          </div>
        </div>
      </div>

      {/* 쿠폰/즐겨찾기 버튼 영역 */}
      <div className="px-5 py-5">
        <div className="flex gap-[21px]">
          {/* 쿠폰 버튼 */}
          <CouponButton label={`쿠폰 ${couponCount}개`} onClick={handleCouponClick} />

          {/* 즐겨찾기 버튼 */}
          <BookmarkButton label="즐겨찾기" onClick={handleBookmarkClick} />
        </div>
      </div>
    </div>
  );
};

export default MembershipBenefitSection;
