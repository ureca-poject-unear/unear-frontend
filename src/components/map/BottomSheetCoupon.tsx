import { useState } from 'react';
import BottomSheet from '@/components/common/BottomSheet';
import CouponCard from '@/components/common/CouponCard';
import StoreCouponCard from '@/components/common/StoreCouponCard';
import ClockIcon from '@/assets/map/mapCouponWatchIcon.svg?react';
import MarkerIcon from '@/assets/map/mapCouponLocationIcon.svg?react';
import MapCouponIcon from '@/assets/map/mapCouponSheetIcon.svg?react';
import type { CategoryType } from '@/components/common/StoreTypeIcon';
import type { StoreStatusType } from '@/components/common/StoreStatus';
import type { CouponCardProps } from '@/components/common/CouponCard';
import CouponModal from '@/components/common/CouponModal';

interface BottomSheetCouponProps {
  isOpen: boolean;
  onClose: () => void;
}

const BottomSheetCoupon = ({ isOpen, onClose }: BottomSheetCouponProps) => {
  const [activeTab, setActiveTab] = useState<'couponbox' | 'nearby'>('couponbox');
  const [selectedCoupon, setSelectedCoupon] = useState<CouponCardProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (coupon: CouponCardProps) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  const mockCoupons: CouponCardProps[] = [
    {
      brand: '스타벅스',
      title: '아메리카노 10% 할인 쿠폰',
      validUntil: '2025.08.16',
      category: 'cafe',
      storeClass: 'franchise',
    },
    {
      brand: '이디야',
      title: '전 메뉴 1천원 할인',
      validUntil: '2025.08.10',
      category: 'cafe',
      storeClass: 'franchise',
    },
    {
      brand: '이디야',
      title: '전 메뉴 1천원 할인',
      validUntil: '2025.08.10',
      category: 'cafe',
      storeClass: 'franchise',
    },
  ];

  const mockStores = [
    {
      id: 'store1',
      name: '스타벅스 강남점',
      address: '서울 강남구 테헤란로 152',
      distance: '0.2km',
      hours: '06:00 - 22:00',
      category: 'cafe' as CategoryType,
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
                        {mockCoupons.length}개
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {mockCoupons.map((coupon, index) => (
                      <CouponCard
                        key={`expire-${index}`}
                        {...coupon}
                        onClick={() => handleCardClick(coupon)}
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
                        {mockCoupons.length}개
                      </span>
                    </div>
                  </div>

                  <div className="space-y-[14px]">
                    {mockCoupons.map((coupon, index) => (
                      <CouponCard
                        key={`all-${index}`}
                        {...coupon}
                        onClick={() => handleCardClick(coupon)}
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
          brand={selectedCoupon.brand}
          title={selectedCoupon.title}
          discountRate={'10%'}
          expireDate={selectedCoupon.validUntil}
          barcodeValue={'123456789012'}
          usageCondition={'쿠폰은 1회만 사용 가능합니다.'}
          usageGuide={[
            '매장에서 결제전 사용자 바코드 제시',
            '쿠폰 바코드 사용 유무를 알린 후 바코드 제시',
            '할인 적용 확인 후 결제',
          ]}
          caution={[
            '다른 할인 쿠폰과 중복 사용 불가',
            '쿠폰 사용 후 환불 불가',
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
