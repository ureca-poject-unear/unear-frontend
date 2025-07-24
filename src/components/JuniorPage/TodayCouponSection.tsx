import React, { useState, useEffect } from 'react';
import { Loader2, DownloadIcon, CheckCircle2 } from 'lucide-react'; // 사용할 아이콘

// 쿠폰 정보를 위한 타입 정의
type Coupon = {
  id: number;
  title: string;
  isDownloaded: boolean;
  isSoldOut: boolean;
};

// API 응답 데이터 타입을 정의합니다. (API 명세에 따라 필요시 수정)
type CouponDownloadData = {
  userCouponId: number;
  couponName: string;
  barcodeNumber: string;
  couponStatusCode: string;
  createdAt: string;
};

const TodayCouponSection: React.FC = () => {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // 초기 쿠폰 상태 설정 (실제로는 API로 데이터를 받아오는 것이 좋습니다)
    setCoupon({
      id: 45, // 백엔드와 약속된 실제 쿠폰 템플릿 ID
      title: '(필수 매장) 20% 할인 쿠폰 (10명 한정)',
      isDownloaded: false,
      isSoldOut: false,
    });
  }, []);

  // 쿠폰 다운로드 처리 함수
  const handleCouponDownload = async (couponTemplateId: number) => {
    setIsDownloading(true);
    setMessage('');

    try {
      // *** 변경된 부분: API 명세에 맞는 올바른 엔드포인트로 수정 ***
      const response = await fetch(`http://dev.unear.site/api/coupons/${couponTemplateId}/fcfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 필요한 경우 인증 토큰 등을 헤더에 추가합니다.
          // 'Authorization': `Bearer YOUR_TOKEN`
        },
      });

      // 응답 본문이 있는지 확인 후 JSON 파싱 시도
      const responseText = await response.text();
      const result = responseText ? JSON.parse(responseText) : {};

      if (response.ok) {
        // 성공 (2xx 상태 코드)
        setCoupon((prevCoupon) => (prevCoupon ? { ...prevCoupon, isDownloaded: true } : null));
        setMessage(result.message || '쿠폰이 성공적으로 다운로드되었습니다.');
        console.log('다운로드 성공:', result.data);
      } else {
        // 실패 (4xx, 5xx 상태 코드)
        setMessage(result.message || `에러가 발생했습니다: ${response.statusText}`);
        // "쿠폰 템플릿을 찾을 수 없습니다" 또는 "매진" 등의 경우
        if (result.codeName === 'COUPON_TEMPLATE_NOT_FOUND' || response.status === 404) {
          setCoupon((prevCoupon) => (prevCoupon ? { ...prevCoupon, isSoldOut: true } : null));
        }
      }
    } catch (error) {
      console.error('쿠폰 다운로드 중 오류 발생:', error);
      setMessage('네트워크 오류가 발생했거나 서버에 연결할 수 없습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!coupon) {
    return (
      <div className="w-[393px] h-[153px] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-[393px] h-auto p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <p className="text-lm font-bold text-black">오늘의 선착순 쿠폰! (12시 초기화!)</p>
      </div>

      <div className="w-full h-[65px] rounded-[15px] bg-[#e6007e] flex items-center justify-between px-5">
        <p className="text-base font-bold text-white">{coupon.title}</p>

        <div className="w-10 h-10 flex items-center justify-center">
          {coupon.isSoldOut ? (
            <p className="text-white font-bold text-sm">마감</p>
          ) : coupon.isDownloaded ? (
            <CheckCircle2 className="w-6 h-6 text-white" />
          ) : (
            <button
              onClick={() => handleCouponDownload(coupon.id)}
              disabled={isDownloading}
              className="w-full h-full flex items-center justify-center"
            >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <DownloadIcon className="w-5 h-5 text-white" />
              )}
            </button>
          )}
        </div>
      </div>
      {message && <p className="mt-2 text-sm text-center text-red-500">{message}</p>}
    </div>
  );
};

export default TodayCouponSection;
