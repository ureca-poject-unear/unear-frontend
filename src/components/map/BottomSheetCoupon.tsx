import { useState, useEffect } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import CouponCard from '@/components/common/CouponCard';
import StoreCouponCard from '@/components/common/StoreCouponCard';
import ClockIcon from '@/assets/map/mapCouponWatchIcon.svg?react';
import MarkerIcon from '@/assets/map/mapCouponLocationIcon.svg?react';
import MapCouponIcon from '@/assets/map/mapCouponSheetIcon.svg?react';
import type { CategoryType } from '@/components/common/StoreTypeIcon';
import type { StoreStatusType } from '@/components/common/StoreStatus';
import CouponModal from '@/components/common/CouponModal';
import { getUserCoupons } from '@/apis/getUserCoupons';
import { getUserCouponDetail } from '@/apis/getUserCouponDetail';
import { isExpiringSoon } from '@/utils/isExpiringSoon';
import type { UserCoupon, UserCouponDetail } from '@/types/coupon';

interface BottomSheetCouponProps {
  isOpen: boolean;
  onClose: () => void;
}

const BottomSheetCoupon = ({ isOpen, onClose }: BottomSheetCouponProps) => {
  const [activeTab, setActiveTab] = useState<'couponbox' | 'nearby'>('couponbox');
  const [selectedCoupon, setSelectedCoupon] = useState<UserCouponDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  const handleCardClick = async (couponId: number) => {
    try {
      const brandName = coupons.find((c) => c.userCouponId === couponId)?.name ?? '';
      setSelectedBrand(brandName);
      const detail = await getUserCouponDetail(couponId);
      if (detail) {
        setSelectedCoupon(detail);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('쿠폰 상세 불러오기 실패', err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      const { coupons } = await getUserCoupons();
      setCoupons(coupons);
    };

    fetchCoupons();
  }, []);

  const expiringSoonCoupons = Array.isArray(coupons) ? coupons.filter(isExpiringSoon) : [];

  const mockStores = [
    {
      id: 'store1',
      name: '스타벅스 강남점',
      address: '서울 강남구 테헤란로 152',
      distance: '0.2km',
      hours: '06:00 - 22:00',
      category: 'CAFE' as CategoryType,
      status: '영업중' as StoreStatusType,
      isBookmarked: false,
      coupons: [
        {
          id: 'coupon1',
          title: '아메리카노 10% 할인 쿠폰',
          expiryDate: '2025.08.16',
        },
      ],
    },
  ];

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} disablePadding={true}>
        <div className="w-full h-[520px] flex flex-col">
          {/* 탭 바 영역: 고정 */}
          <div className="shrink-0 pt-4 bg-white z-10">
            <div className="flex text-m font-semibold text-center">
              <button
                onClick={() => setActiveTab('couponbox')}
                className={`flex-1 pb-1 -mb-[1px] ${
                  activeTab === 'couponbox'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-400 border-b-2 border-gray-300'
                }`}
              >
                쿠폰함
              </button>
              <button
                onClick={() => setActiveTab('nearby')}
                className={`flex-1 pb-1 -mb-[1px] ${
                  activeTab === 'nearby'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-400 border-b-2 border-gray-300'
                }`}
              >
                주변 매장
              </button>
            </div>
          </div>

          {/* 콘텐츠 영역: 스크롤 대상 */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'couponbox' && (
              <div className="space-y-4">
                {/* 곧 만료 예정 */}
                <div className="mt-4 ml-5 mr-5">
                  <div className="flex items-center gap-x-2 mb-2">
                    <ClockIcon className="w-4 h-4 shrink-0" />
                    <span className="text-lm font-semibold whitespace-nowrap relative top-[2px]">
                      곧 만료 예정
                    </span>
                    <div className="w-[48px] h-[18px] bg-pink-100 rounded-[12px] flex items-center justify-center flex-shrink-0 relative top-[1px]">
                      <span className="text-s font-semibold text-pink-700 mt-[3px]">
                        {expiringSoonCoupons.length}개
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {expiringSoonCoupons.map((coupon) => (
                      <CouponCard
                        key={`soon-${coupon.userCouponId}`}
                        brand={coupon.name}
                        title={coupon.couponName}
                        validUntil={coupon.couponEnd}
                        category={coupon.categoryCode}
                        storeClass={coupon.markerCode}
                        onClick={() => handleCardClick(coupon.userCouponId)}
                      />
                    ))}
                  </div>
                </div>

                {/* 전체 쿠폰 */}
                <div className="mt-6 ml-5 mr-5 pb-[10px]">
                  <div className="flex items-center gap-x-2 mb-2">
                    <MapCouponIcon className="w-5 h-5 shrink-0" />
                    <span className="text-lm font-semibold whitespace-nowrap relative top-[2px]">
                      전체 쿠폰
                    </span>
                    <div className="w-[48px] h-[18px] bg-pink-100 rounded-[12px] flex items-center justify-center flex-shrink-0 relative top-[1px]">
                      <span className="text-s font-semibold text-pink-700 mt-[3px]">
                        {coupons.length}개
                      </span>
                    </div>
                  </div>

                  <div className="space-y-[14px]">
                    {coupons.map((coupon) => (
                      <CouponCard
                        key={`all-${coupon.userCouponId}`}
                        brand={coupon.name}
                        title={coupon.couponName}
                        validUntil={coupon.couponEnd}
                        category={coupon.categoryCode}
                        storeClass={coupon.markerCode}
                        onClick={() => handleCardClick(coupon.userCouponId)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nearby' && (
              <div className="mt-4 ml-5 mr-5 pb-[10px]">
                <div className="flex items-center gap-x-2 mb-2">
                  <MarkerIcon className="w-4 h-4 shrink-0" />
                  <span className="text-lm font-semibold whitespace-nowrap relative top-[2px]">
                    가까운 매장
                  </span>
                  <div className="w-[48px] h-[18px] bg-pink-100 rounded-[12px] flex items-center justify-center flex-shrink-0 relative top-[1px]">
                    <span className="text-s font-semibold text-pink-700 mt-[3px]">
                      {mockStores.length}개
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-[23px]">
                  {mockStores.map((store) => (
                    <StoreCouponCard key={store.id} store={store} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </BottomSheet>

      {selectedCoupon && isModalOpen && (
        <CouponModal
          brand={selectedBrand}
          title={selectedCoupon.couponName}
          discountRate={
            selectedCoupon.discountCode === 'COUPON_PERCENT'
              ? `${selectedCoupon.discountPercent}%`
              : `${selectedCoupon.fixedDiscount?.toLocaleString() ?? 0}원`
          }
          expireDate={selectedCoupon.couponEnd}
          barcodeValue={selectedCoupon.barcodeNumber}
          usageCondition={
            selectedCoupon.discountCode === 'COUPON_FIXED'
              ? `최소 ${selectedCoupon.minPurchaseAmount?.toLocaleString() ?? 0}원 이상 구매 시`
              : `최대 ${selectedCoupon.maxDiscountAmount?.toLocaleString() ?? 0}원 할인`
          }
          usageGuide={[
            '매장에서 결제 전 바코드 제시',
            '직원에게 쿠폰 사용 의사 전달',
            '할인 적용 후 결제',
          ]}
          caution={[
            '다른 할인 쿠폰과 중복 사용 불가',
            '사용 후 환불 불가',
            '타인 양도 및 교환 불가',
            '유효기간 경과 시 자동 소멸',
          ]}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default BottomSheetCoupon;
