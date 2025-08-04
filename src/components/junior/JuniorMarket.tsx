// src/app/(main)/junior-market/page.tsx (최종본)

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import BookmarkCard from '@/components/common/BookmarkCard';
import { getPlaces } from '@/apis/getPlaces';
import { getPlaceDetail } from '@/apis/getPlaceDetail';
import { postDownloadCoupon } from '@/apis/postDownloadCoupon';
import { toggleFavorite } from '@/apis/postFavorite';

import type { BookmarkStore } from '@/types/bookmark';
import type { Place } from '@/types/map';
import type { CategoryType, EventType, StoreClassType } from '@/components/common/StoreTypeIcon';

import GiftIcon from '@/assets/map/giftIcon.svg?react';
import CouponIcon from '@/assets/common/couponIcon.svg?react';
import ArrowDownIcon from '@/assets/common/arrowDownIcon.svg?react';
import ArrowUpIcon from '@/assets/common/arrowUpIcon.svg?react';
import DownloadIcon from '@/assets/common/downloadIcon.svg?react';

// 컴포넌트 내에서 사용할 로컬 쿠폰 타입 정의
interface Coupon {
  couponTemplateId: number;
  userCouponId: number | null;
  couponName: string;
  couponEnd?: string;
  downloaded: boolean;
}

// 기존 BookmarkStore를 확장하여 이 컴포넌트에 필요한 속성을 추가한 새 타입 정의
interface JuniorMarketStore extends BookmarkStore {
  benefitDesc?: string;
  coupons?: Coupon[];
  status: string;
}

const JuniorMarket = () => {
  const [stores, setStores] = useState<JuniorMarketStore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStores, setExpandedStores] = useState<Set<string>>(new Set());
  const [downloadingCoupons, setDownloadingCoupons] = useState<Set<string>>(new Set());
  const [downloadedCoupons, setDownloadedCoupons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSeoulEventStores = async () => {
      try {
        setIsLoading(true);
        const seoulBounds = {
          swLat: 37.42,
          swLng: 126.73,
          neLat: 37.7,
          neLng: 127.2,
        };
        const allPlacesInSeoul: Place[] = await getPlaces(seoulBounds);
        const eventPlaces = allPlacesInSeoul.filter((p) => p.eventCode !== 'NONE');

        if (eventPlaces.length === 0) {
          setStores([]);
          setIsLoading(false);
          return;
        }

        const centerLatStr = '37.544581';
        const centerLngStr = '127.055961';

        const detailResults = await Promise.allSettled(
          eventPlaces.map((place) => getPlaceDetail(place.placeId, centerLatStr, centerLngStr))
        );

        const successfulDetails = detailResults
          .filter((result) => result.status === 'fulfilled' && result.value)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((result) => (result as PromiseFulfilledResult<any>).value);

        const finalStoreInfo: JuniorMarketStore[] = successfulDetails.map((detail) => {
          const originalPlace = eventPlaces.find((p: Place) => p.placeId === detail.placeId)!;

          return {
            id: String(detail.placeId),
            name: detail.name,
            address: detail.address,
            hours: detail.hours,
            distance: String(detail.distance),
            isBookmarked: detail.isBookmarked,
            category: detail.category as CategoryType,
            event: detail.eventTypeCode as EventType,
            storeClass: originalPlace.markerCode as StoreClassType,
            phoneNumber: detail.tel,
            benefitDesc: detail.benefitDesc,
            coupons: detail.coupons,
            status: detail.status,
          };
        });

        const sortedStores = finalStoreInfo.sort((a, b) => {
          if (a.event === 'REQUIRE' && b.event !== 'REQUIRE') return -1;
          if (a.event !== 'REQUIRE' && b.event === 'REQUIRE') return 1;
          return 0;
        });

        setStores(sortedStores);
      } catch (err) {
        setError('매장 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeoulEventStores();
  }, []);

  const handleBookmarkToggle = async (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) return;

    const previousIsBookmarked = store.isBookmarked;

    setStores((prevStores) =>
      prevStores.map((s) => (s.id === storeId ? { ...s, isBookmarked: !s.isBookmarked } : s))
    );

    try {
      await toggleFavorite(Number(storeId));
    } catch (err) {
      console.error('즐겨찾기 변경 실패:', err);
      alert('즐겨찾기 변경에 실패했습니다.');
      setStores((prevStores) =>
        prevStores.map((s) => (s.id === storeId ? { ...s, isBookmarked: previousIsBookmarked } : s))
      );
    }
  };

  const handleExpandToggle = (storeId: string) => {
    setExpandedStores((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(storeId)) {
        newSet.delete(storeId);
      } else {
        newSet.add(storeId);
      }
      return newSet;
    });
  };

  const handleCouponDownload = async (storeId: string, couponTemplateId: string) => {
    setDownloadingCoupons((prev) => new Set(prev).add(couponTemplateId));

    try {
      await postDownloadCoupon(Number(couponTemplateId));
      setDownloadedCoupons((prev) => new Set(prev).add(couponTemplateId));

      const centerLatStr = '37.544581';
      const centerLngStr = '127.055961';
      const updatedDetail = await getPlaceDetail(Number(storeId), centerLatStr, centerLngStr);

      if (updatedDetail) {
        setStores((prevStores) =>
          prevStores.map((s) => {
            if (s.id === storeId) {
              return {
                ...s,
                isBookmarked: updatedDetail.isBookmarked,
                benefitDesc: updatedDetail.benefitDesc,
                coupons: updatedDetail.coupons,
                status: updatedDetail.status,
              };
            }
            return s;
          })
        );
      }
    } catch (err) {
      console.error('쿠폰 다운로드 실패:', err);
      alert('쿠폰 다운로드에 실패했습니다.');
    } finally {
      setDownloadingCoupons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(couponTemplateId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return <div className="p-5 text-center text-gray-500">매장 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-5 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-5 bg-white">
      <div className="m-2 mb-4">
        <p className="ml-3 text-lm font-bold text-black">이번주니어 매장</p>
      </div>
      <div className="flex flex-col items-start gap-4">
        {stores.length > 0 ? (
          stores.map((store) => (
            <div key={store.id} className="w-full rounded-lg border border-gray-200 p-4">
              <BookmarkCard store={store} onBookmarkToggle={() => handleBookmarkToggle(store.id)} />

              {store.benefitDesc && (
                <div className="mt-4 px-4 py-3 bg-gray-100 rounded-[8px]">
                  <div className="flex items-center gap-2 mb-1">
                    <GiftIcon />
                    <span className="font-semibold text-sm mt-[3px] text-black">혜택 정보</span>
                  </div>
                  <p className="font-semibold text-sm text-gray-800 leading-[21px]">
                    · {store.benefitDesc}
                  </p>
                </div>
              )}

              {store.coupons && store.coupons.length > 0 && (
                <>
                  <div className="mt-5 flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-[10px] h-[10px] bg-green-400 rounded-full" />
                      <span className="font-semibold text-sm text-black leading-none relative top-[1px]">
                        사용 가능한 쿠폰 {store.coupons.length}개
                      </span>
                    </div>
                    <button onClick={() => handleExpandToggle(store.id)} className="p-1">
                      {expandedStores.has(store.id) ? (
                        <ArrowUpIcon className="w-[18px] h-[10px] text-black" />
                      ) : (
                        <ArrowDownIcon className="w-[18px] h-[10px] text-black" />
                      )}
                    </button>
                  </div>

                  {expandedStores.has(store.id) && (
                    <div className="mt-4 space-y-3">
                      {store.coupons.map((coupon, index) => {
                        const couponTemplateIdStr = String(coupon.couponTemplateId);
                        return (
                          <div
                            key={coupon.userCouponId ?? `coupon-${index}`}
                            className="relative bg-white border border-[#D4D4D8] rounded-[5px] p-3 w-full h-[46px]"
                          >
                            <div className="absolute left-3 top-3">
                              <CouponIcon />
                            </div>
                            <div className="ml-8">
                              <h4 className="font-bold text-s text-black leading-[12px]">
                                {coupon.couponName}
                              </h4>
                              <p className="text-xs text-gray-400 mt-[2px]">
                                {coupon.couponEnd?.split('T')[0]} 까지
                              </p>
                            </div>

                            {!coupon.downloaded && !downloadedCoupons.has(couponTemplateIdStr) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCouponDownload(store.id, couponTemplateIdStr);
                                }}
                                className="absolute right-3 top-[13px] w-5 h-5 flex items-center justify-center"
                                disabled={downloadingCoupons.has(couponTemplateIdStr)}
                              >
                                {downloadingCoupons.has(couponTemplateIdStr) ? (
                                  <Loader2 className="w-5 h-5 animate-spin text-black" />
                                ) : (
                                  <DownloadIcon className="w-5 h-5 text-black" />
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <div className="p-5 text-center text-gray-500">표시할 이벤트 매장이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default JuniorMarket;
