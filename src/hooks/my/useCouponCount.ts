import { useState, useEffect } from 'react';

const useCouponCount = () => {
  const [couponCount, setCouponCount] = useState(0);

  useEffect(() => {
    const fetchCouponCount = async () => {
      // TODO: 실제 API 호출로 대체
      // 목업 쿠폰 개수 (useCouponData와 동일한 데이터 기준)
      const mockCouponCount = 6; // 현재 목업 데이터 기준
      setCouponCount(mockCouponCount);
    };

    fetchCouponCount();
  }, []);

  return couponCount;
};

export default useCouponCount;
