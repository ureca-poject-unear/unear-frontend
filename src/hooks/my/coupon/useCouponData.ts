import { useState, useEffect } from 'react';
import type { CouponData, CouponItem } from '@/types/coupon';

const useCouponData = () => {
  const [couponData, setCouponData] = useState<CouponData>({
    expiringSoonCoupons: [],
    allCoupons: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCouponData = async () => {
      setIsLoading(true);

      // TODO: 실제 API 호출로 대체
      // 목업 데이터
      const mockCoupons: CouponItem[] = [
        {
          id: 'coupon1',
          brand: '스타벅스',
          title: '스타벅스 10% 할인 쿠폰',
          discountRate: '10%',
          validUntil: '2024.07.15',
          category: 'CAFE',
          storeClass: 'FRANCHISE',
          barcodeValue: '123456789012',
          usageCondition: '쿠폰은 1회만 사용 가능합니다.',
          usageGuide: [
            '매장에서 결제전 사용자 바코드 제시',
            '쿠폰 바코드 사용 유무를 알린 후 바코드 제시',
            '할인 적용 확인 후 결제',
          ],
          caution: [
            '다른 할인 쿠폰과 중복 사용 불가',
            '쿠폰 사용 후 환불 불가',
            '타인 양도 및 교환 불가',
            '유효기간 경과 시 자동 소멸',
          ],
          isExpiringSoon: true,
        },
        {
          id: 'coupon2',
          brand: '스타벅스',
          title: '스타벅스 10% 할인 쿠폰',
          discountRate: '10%',
          validUntil: '2024.07.15',
          category: 'CAFE',
          storeClass: 'FRANCHISE',
          barcodeValue: '123456789013',
          usageCondition: '쿠폰은 1회만 사용 가능합니다.',
          usageGuide: [
            '매장에서 결제전 사용자 바코드 제시',
            '쿠폰 바코드 사용 유무를 알린 후 바코드 제시',
            '할인 적용 확인 후 결제',
          ],
          caution: [
            '다른 할인 쿠폰과 중복 사용 불가',
            '쿠폰 사용 후 환불 불가',
            '타인 양도 및 교환 불가',
            '유효기간 경과 시 자동 소멸',
          ],
          isExpiringSoon: true,
        },
        {
          id: 'coupon3',
          brand: '스타벅스',
          title: '스타벅스 10% 할인 쿠폰',
          discountRate: '10%',
          validUntil: '2024.07.15',
          category: 'CAFE',
          storeClass: 'FRANCHISE',
          barcodeValue: '123456789014',
          usageCondition: '쿠폰은 1회만 사용 가능합니다.',
          usageGuide: [
            '매장에서 결제전 사용자 바코드 제시',
            '쿠폰 바코드 사용 유무를 알린 후 바코드 제시',
            '할인 적용 확인 후 결제',
          ],
          caution: [
            '다른 할인 쿠폰과 중복 사용 불가',
            '쿠폰 사용 후 환불 불가',
            '타인 양도 및 교환 불가',
            '유효기간 경과 시 자동 소멸',
          ],
        },
        {
          id: 'coupon4',
          brand: '스타벅스',
          title: '스타벅스 10% 할인 쿠폰',
          discountRate: '10%',
          validUntil: '2024.08.15',
          category: 'CAFE',
          storeClass: 'FRANCHISE',
          barcodeValue: '123456789015',
          usageCondition: '쿠폰은 1회만 사용 가능합니다.',
          usageGuide: [
            '매장에서 결제전 사용자 바코드 제시',
            '쿠폰 바코드 사용 유무를 알린 후 바코드 제시',
            '할인 적용 확인 후 결제',
          ],
          caution: [
            '다른 할인 쿠폰과 중복 사용 불가',
            '쿠폰 사용 후 환불 불가',
            '타인 양도 및 교환 불가',
            '유효기간 경과 시 자동 소멸',
          ],
        },
        {
          id: 'coupon5',
          brand: '파리바게뜨',
          title: '파리바게뜨 10% 할인 쿠폰',
          discountRate: '10%',
          validUntil: '2024.08.15',
          category: 'BAKERY',
          storeClass: 'FRANCHISE',
          barcodeValue: '123456789016',
          usageCondition: '쿠폰은 1회만 사용 가능합니다.',
          usageGuide: [
            '매장에서 결제전 사용자 바코드 제시',
            '쿠폰 바코드 사용 유무를 알린 후 바코드 제시',
            '할인 적용 확인 후 결제',
          ],
          caution: [
            '다른 할인 쿠폰과 중복 사용 불가',
            '쿠폰 사용 후 환불 불가',
            '타인 양도 및 교환 불가',
            '유효기간 경과 시 자동 소멸',
          ],
        },
        {
          id: 'coupon6',
          brand: '스타벅스',
          title: '스타벅스 10% 할인 쿠폰',
          discountRate: '10%',
          validUntil: '2024.09.15',
          category: 'CAFE',
          storeClass: 'FRANCHISE',
          barcodeValue: '123456789017',
          usageCondition: '쿠폰은 1회만 사용 가능합니다.',
          usageGuide: [
            '매장에서 결제전 사용자 바코드 제시',
            '쿠폰 바코드 사용 유무를 알린 후 바코드 제시',
            '할인 적용 확인 후 결제',
          ],
          caution: [
            '다른 할인 쿠폰과 중복 사용 불가',
            '쿠폰 사용 후 환불 불가',
            '타인 양도 및 교환 불가',
            '유효기간 경과 시 자동 소멸',
          ],
        },
      ];

      // 곧 만료 예정 쿠폰 필터링
      const expiringSoonCoupons = mockCoupons.filter((coupon) => coupon.isExpiringSoon);

      const data: CouponData = {
        expiringSoonCoupons,
        allCoupons: mockCoupons,
        totalCount: mockCoupons.length,
      };

      setCouponData(data);
      setIsLoading(false);
    };

    fetchCouponData();
  }, []);

  return { couponData, isLoading };
};

export default useCouponData;
