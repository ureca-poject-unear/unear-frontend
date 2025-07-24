import StoreTypeIcon from '@/components/common/StoreTypeIcon';
import CouponBackground from '@/assets/common/coupon.svg?react';

export interface CouponCardProps {
  brand: string;
  title: string;
  validUntil: string;
  category:
    | 'CAFE'
    | 'FOOD'
    | 'SHOPPING'
    | 'EDUCATION'
    | 'CULTURE'
    | 'BAKERY'
    | 'BEAUTY'
    | 'LIFE'
    | 'ACTIVITY'
    | 'POPUP';
  storeClass: 'FRANCHISE' | 'LOCAL' | 'BASIC';
  onClick?: () => void;
}

const CouponCard = ({
  brand,
  title,
  validUntil,
  category,
  storeClass,
  onClick,
}: CouponCardProps) => {
  return (
    <div
      className="relative w-full h-[107px] max-w-[393px] drop-shadow-[0_0px_10px_rgba(0,0,0,0.15)] cursor-pointer"
      onClick={onClick}
    >
      <CouponBackground className="w-full h-full" />
      <div className="absolute inset-0 flex items-center px-2 py-3 gap-x-8">
        {/* 아이콘 */}
        <div className="pl-8">
          <StoreTypeIcon category={category} storeClass={storeClass} size={48} shape="square" />
        </div>

        {/* 세로 점선 */}
        <div className="h-full border-l-2 border-dashed border-gray-300" />

        {/* 텍스트 정보 */}
        <div className="flex flex-col justify-between h-full py-1">
          {/* 브랜드명 */}
          <p className="text-s font-regular text-black">{brand}</p>

          {/* 쿠폰 타이틀 */}
          <p className="text-sm font-semibold text-black">{title}</p>

          {/* 유효기한 */}
          <p className="text-s font-semibold text-gray-400">{validUntil}까지</p>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
