import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, DownloadIcon, CheckCircle2 } from 'lucide-react';

// 쿠폰 정보를 위한 타입 정의
type Coupon = {
  id: number;
  title: string;
  isDownloaded: boolean;
  isSoldOut: boolean;
};

// API 응답 데이터 타입을 정의합니다.
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
  const navigate = useNavigate();

  useEffect(() => {
    // 초기 쿠폰 상태 설정 (실제로는 API로 데이터를 받아오는 것이 좋습니다)
    const couponId = 45; // 백엔드와 약속된 실제 쿠폰 템플릿 ID

    // [수정] 로컬 스토리지에서 해당 쿠폰의 다운로드 상태를 확인
    const isAlreadyDownloaded = localStorage.getItem(`coupon-${couponId}-downloaded`) === 'true';

    setCoupon({
      id: couponId,
      title: '(필수 매장) 20% 할인 쿠폰 (10명 한정)',
      isDownloaded: isAlreadyDownloaded, // 로컬 스토리지 상태를 반영
      isSoldOut: false,
    });
  }, []);

  // 쿠폰 다운로드 처리 함수
  const handleCouponDownload = async (couponTemplateId: number) => {
    setIsDownloading(true);
    setMessage('');

    try {
      const token = sessionStorage.getItem('temp_access_token');

      if (!token) {
        setMessage('쿠폰을 받으려면 로그인이 필요합니다.');
        setIsDownloading(false);
        navigate('/login');
        return;
      }

      const response = await fetch(
        `https://dev.unear.site/api/app/coupons/${couponTemplateId}/fcfs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();
      const result = responseText ? JSON.parse(responseText) : {};

      if (response.ok) {
        setCoupon((prevCoupon) => (prevCoupon ? { ...prevCoupon, isDownloaded: true } : null));
        setMessage(result.message || '쿠폰이 성공적으로 다운로드되었습니다.');
        console.log('다운로드 성공:', result.data);

        // [추가] 다운로드 성공 시 로컬 스토리지에 상태 저장
        localStorage.setItem(`coupon-${couponTemplateId}-downloaded`, 'true');
      } else {
        setMessage(result.message || `에러가 발생했습니다: ${response.statusText}`);

        if (
          result.codeName === 'COUPON_TEMPLATE_NOT_FOUND' ||
          response.status === 404 ||
          result.message === '매진되었습니다.'
        ) {
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
    <div className="w-[393px] h-auto p-4 bg-white">
      <div className="m-2 mb-4">
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
      {/* 사용자에게 피드백 메시지를 보여주는 부분 */}
      {message && <p className="mt-2 text-sm text-center text-red-500">{message}</p>}
    </div>
  );
};

export default TodayCouponSection;
