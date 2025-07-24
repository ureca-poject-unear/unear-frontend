import CouponCard from '@/components/common/CouponCard';
import CouponHeader from './CouponHeader';
import type { CouponItem } from '@/types/coupon';

interface CouponListProps {
  coupons: CouponItem[];
  title: string;
  icon?: 'clock' | 'coupon';
  onCouponClick: (coupon: CouponItem) => void;
}

const CouponList = ({ coupons, title, icon = 'coupon', onCouponClick }: CouponListProps) => {
  if (coupons.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <CouponHeader title={title} count={coupons.length} icon={icon} />

      <div className="space-y-3">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            brand={coupon.brand}
            title={coupon.title}
            validUntil={coupon.validUntil}
            category={coupon.category}
            storeClass={coupon.storeClass}
            onClick={() => onCouponClick(coupon)}
          />
        ))}
      </div>
    </div>
  );
};

export default CouponList;
