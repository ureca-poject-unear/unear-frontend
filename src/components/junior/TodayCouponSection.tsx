import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';

import CouponIcon from '@/assets/common/couponIcon.svg?react';
import DownloadIcon from '@/assets/common/downloadIcon.svg?react';

type Coupon = {
  id: number;
  title: string;
  isDownloaded: boolean;
  isSoldOut: boolean;
};

const TodayCouponSection: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [downloadingCoupons, setDownloadingCoupons] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [isExpanded] = useState(true);
  const navigate = useNavigate();

  // [핵심 1] 로컬 스토리지에서 다운로드된 쿠폰 ID 목록을 가져오는 헬퍼 함수
  const getDownloadedCouponsFromLocal = (): number[] => {
    const localData = localStorage.getItem('downloadedCoupons');
    return localData ? JSON.parse(localData) : [];
  };

  const checkCouponStatus = async (couponTemplateId: number) => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('temp_access_token');
      const couponTitle = '(필수 매장) 20% 할인 쿠폰 (10명 한정)';
      const locallyDownloadedIds = getDownloadedCouponsFromLocal();

      if (!token) {
        setCoupons([
          {
            id: couponTemplateId,
            title: couponTitle,
            // [핵심 2] 로컬 스토리지 확인하여 다운로드 상태 결정
            isDownloaded: locallyDownloadedIds.includes(couponTemplateId),
            isSoldOut: false,
          },
        ]);
        return;
      }

      const response = await fetch(
        `https://dev.unear.site/api/app/coupons/${couponTemplateId}/status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setCoupons([
          {
            id: couponTemplateId,
            title: couponTitle,
            // [핵심 3] 서버 상태 또는 로컬 상태 둘 중 하나라도 true이면 다운로드된 것으로 간주
            isDownloaded:
              result.data?.isDownloaded || locallyDownloadedIds.includes(couponTemplateId),
            isSoldOut: result.data?.isSoldOut || false,
          },
        ]);
      } else {
        throw new Error(result.message || '쿠폰 상태 확인에 실패했습니다.');
      }
    } catch (error) {
      console.error('쿠폰 상태 확인 중 오류 발생:', error);
      const locallyDownloadedIds = getDownloadedCouponsFromLocal();
      setCoupons([
        {
          id: 326,
          title: '(필수 매장) 20% 할인 쿠폰 (100명 한정)',
          isDownloaded: locallyDownloadedIds.includes(326),
          isSoldOut: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const couponId = 326;
    checkCouponStatus(couponId);
  }, []);

  const handleCouponDownload = async (couponId: number) => {
    setDownloadingCoupons((prev) => new Set(prev).add(couponId));
    setMessage('');

    try {
      const token = sessionStorage.getItem('temp_access_token');
      if (!token) {
        setMessage('쿠폰을 받으려면 로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const response = await fetch(`https://dev.unear.site/api/app/coupons/${couponId}/fcfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || '쿠폰이 성공적으로 다운로드되었습니다.');

        // [핵심 4] 다운로드 성공 시 로컬 스토리지에 ID 저장
        const downloadedIds = getDownloadedCouponsFromLocal();
        if (!downloadedIds.includes(couponId)) {
          downloadedIds.push(couponId);
          localStorage.setItem('downloadedCoupons', JSON.stringify(downloadedIds));
        }

        setCoupons((prevCoupons) =>
          prevCoupons.map((c) => (c.id === couponId ? { ...c, isDownloaded: true } : c))
        );
      } else {
        setMessage(result.message || `에러: ${response.statusText}`);
        if (result.message === '매진되었습니다.') {
          setCoupons((prevCoupons) =>
            prevCoupons.map((c) => (c.id === couponId ? { ...c, isSoldOut: true } : c))
          );
        }
      }
    } catch (error) {
      console.error('쿠폰 다운로드 중 오류 발생:', error);
      setMessage('네트워크 오류가 발생했습니다.');
    } finally {
      setDownloadingCoupons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(couponId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[153px] flex justify-center items-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-auto p-4 bg-white">
      <div className="m-2 mb-4">
        <p className="text-lm font-bold text-black">오늘의 선착순 쿠폰! (12시 초기화)</p>
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center"></div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="relative bg-white border border-gray-200 rounded-[5px] p-3 w-full h-[65px] flex items-center"
            >
              <div className="flex-shrink-0">
                <CouponIcon />
              </div>
              <div className="ml-4 flex-grow">
                <h4 className="font-bold text-base text-black">{coupon.title}</h4>
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center">
                {coupon.isSoldOut ? (
                  <p className="text-gray-500 font-bold text-sm">마감</p>
                ) : coupon.isDownloaded ? (
                  <CheckCircle2 className="w-6 h-6 text-pink-500" />
                ) : (
                  <button
                    onClick={() => handleCouponDownload(coupon.id)}
                    disabled={downloadingCoupons.has(coupon.id)}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {downloadingCoupons.has(coupon.id) ? (
                      <Loader2 className="w-5 h-5 animate-spin text-black" />
                    ) : (
                      <DownloadIcon className="w-5 h-5 text-black" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {message && <p className="mt-4 text-sm text-center text-red-500">{message}</p>}
    </div>
  );
};

export default TodayCouponSection;
