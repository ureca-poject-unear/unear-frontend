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

// 쿠폰 상태 확인 API 응답 타입
type CouponStatusResponse = {
  message: string;
  data: {
    isDownloaded: boolean;
    isSoldOut: boolean;
  };
};

const TodayCouponSection: React.FC = () => {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  // 사용자의 쿠폰 다운로드 상태를 서버에서 확인하는 함수
  const checkCouponStatus = async (couponTemplateId: number) => {
    try {
      const token = sessionStorage.getItem('temp_access_token');

      if (!token) {
        // 토큰이 없으면 다운로드되지 않은 상태로 설정
        setCoupon({
          id: couponTemplateId,
          title: '(필수 매장) 20% 할인 쿠폰 (10명 한정)',
          isDownloaded: false,
          isSoldOut: false,
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `https://dev.unear.site/api/app/coupons/${couponTemplateId}/status`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseText = await response.text();
      const result = responseText ? JSON.parse(responseText) : {};

      if (response.ok) {
        setCoupon({
          id: couponTemplateId,
          title: '(필수 매장) 20% 할인 쿠폰 (10명 한정)',
          isDownloaded: result.data?.isDownloaded || false,
          isSoldOut: result.data?.isSoldOut || false,
        });
      } else {
        // API 에러 시 기본값으로 설정
        setCoupon({
          id: couponTemplateId,
          title: '(필수 매장) 20% 할인 쿠폰 (10명 한정)',
          isDownloaded: false,
          isSoldOut: false,
        });
        console.error('쿠폰 상태 확인 실패:', result.message);
      }
    } catch (error) {
      console.error('쿠폰 상태 확인 중 오류 발생:', error);
      // 네트워크 오류 시 기본값으로 설정
      setCoupon({
        id: couponTemplateId,
        title: '(필수 매장) 20% 할인 쿠폰 (10명 한정)',
        isDownloaded: false,
        isSoldOut: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const couponId = 45; // 백엔드와 약속된 실제 쿠폰 템플릿 ID
    checkCouponStatus(couponId);
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

  if (isLoading || !coupon) {
    return (
      <div className="w-full max-w-[600px] mx-auto h-[153px] flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mx-auto bg-white">
      <div className="px-5 py-4">
        <p className="text-lm font-bold text-black">오늘의 선착순 쿠폰! (12시 초기화!)</p>
      </div>

      <div className="px-5 pb-4">
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
    </div>
  );
};

export default TodayCouponSection;
