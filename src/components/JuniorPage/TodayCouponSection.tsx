import React, { useState } from 'react';
import { Loader2, DownloadIcon } from 'lucide-react'; // 예시 아이콘, 사용하는 라이브러리에 맞게 수정

type Coupon = {
  id: string;
  downloaded: boolean;
  title: string;
};

const TodayCouponSection: React.FC = () => {
  const [downloadedCoupons, setDownloadedCoupons] = useState<Set<string>>(new Set());
  const [downloadingCoupons, setDownloadingCoupons] = useState<Set<string>>(new Set());

  const coupon: Coupon = {
    id: 'coupon-1',
    downloaded: downloadedCoupons.has('coupon-1'),
    title: '(필수 매장) 20% 할인 쿠폰 (10명 한정)',
  };

  const handleCouponDownload = (couponId: string) => {
    setDownloadingCoupons((prev) => new Set(prev).add(couponId));
    console.log('다운로드 시작됨');

    setTimeout(() => {
      setDownloadingCoupons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(couponId);
        return newSet;
      });

      setDownloadedCoupons((prev) => new Set(prev).add(couponId));
      console.log('다운로드 완료됨');
    }, 1000);
  };

  return (
    <div className="w-[393px] h-[153px] relative">
      <div className="w-[393px] h-[153px] absolute bg-white" />

      <div className="w-[353px] h-[25px] top-[15px] left-[20px] absolute">
        <p className="absolute left-0 top-0.5 text-lm font-bold text-left text-black">
          오늘의 선착순 쿠폰! (12시 초기화!)
        </p>
      </div>

      <div className="w-[353px] h-[65px] absolute left-[20px] top-[60px] overflow-hidden rounded-[15px] bg-[#e6007e] flex items-center justify-between px-5">
        <p className="text-base font-bold text-left text-white">{coupon.title}</p>

        {!coupon.downloaded && !downloadedCoupons.has(coupon.id) && (
          <div className="w-5 h-5 flex items-center justify-center">
            <button
              onClick={() => handleCouponDownload(coupon.id)}
              disabled={downloadingCoupons.has(coupon.id)}
            >
              {downloadingCoupons.has(coupon.id) ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <DownloadIcon className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayCouponSection;
