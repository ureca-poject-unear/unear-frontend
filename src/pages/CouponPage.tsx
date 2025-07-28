import Header from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import CouponModal from '@/components/common/CouponModal';
import { CouponList } from '@/components/my/coupon';
import useCouponData from '@/hooks/my/coupon/useCouponData';
import useCouponHandlers from '@/hooks/my/coupon/useCouponHandlers';

const CouponPage = () => {
  const { couponData, isLoading } = useCouponData();
  const { onBack, onCouponClick, selectedCoupon, isModalOpen, handleCloseModal } =
    useCouponHandlers();

  if (isLoading) {
    return (
      <>
        <Header title="쿠폰" onBack={onBack} />
        <div className="bg-background">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-105px)]">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm font-regular text-gray-600">쿠폰 정보를 불러오는 중...</p>
          </div>
        </div>
      </>
    );
  }

  const hasAnyCoupons = couponData.totalCount > 0;

  return (
    <>
      <Header title="쿠폰" onBack={onBack} />

      <div className="px-5 py-4 bg-background min-h-[calc(100vh-105px)]">
        {!hasAnyCoupons ? (
          <div className="h-full flex items-center justify-center">
            <EmptyState message="보유한 쿠폰이 없습니다" />
          </div>
        ) : (
          <>
            {/* 곧 만료 예정 쿠폰 */}
            {couponData.expiringSoonCoupons.length > 0 && (
              <CouponList
                coupons={couponData.expiringSoonCoupons}
                title="곧 만료 예정"
                icon="clock"
                onCouponClick={onCouponClick}
              />
            )}

            {/* 전체 쿠폰 */}
            <CouponList
              coupons={couponData.allCoupons}
              title="전체 쿠폰"
              icon="coupon"
              onCouponClick={onCouponClick}
            />
          </>
        )}
      </div>

      {/* 쿠폰 상세 모달 */}
      {selectedCoupon && isModalOpen && (
        <CouponModal
          brand={selectedCoupon.brand}
          title={selectedCoupon.title}
          discountRate={selectedCoupon.discountRate}
          expireDate={selectedCoupon.validUntil}
          barcodeValue={selectedCoupon.barcodeValue}
          usageCondition={selectedCoupon.usageCondition}
          usageGuide={selectedCoupon.usageGuide}
          caution={selectedCoupon.caution}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default CouponPage;
