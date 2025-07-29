// src/components/JuniorPage/JuniorMarket.tsx

import React, { useState, useEffect } from 'react';
import BookmarkCard from '@/components/common/BookmarkCard';
import type { StoreInfo } from '@/components/common/BookmarkCard';
import type { Place } from '@/apis/getPlaces';
import { getPlaces } from '@/apis/getPlaces';
import { getPlaceDetail } from '@/apis/getPlaceDetail';
import type {
  CategoryType,
  EventType,
  StoreClassType,
  StoreStatusType,
} from '@/components/common/StoreTypeIcon';

const getStoreNameColorClass = (eventTypeCode: EventType): string => {
  switch (eventTypeCode) {
    case 'GENERAL':
      return 'text-blue-600';
    case 'REQUIRE':
      return 'text-red-600';
    default:
      return 'text-gray-900';
  }
};

const JuniorMarket = () => {
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeoulEventStores = async () => {
      try {
        setIsLoading(true);

        // 서울시 전체 영역으로 매장 검색
        const seoulBounds = {
          swLat: 37.42,
          swLng: 126.73,
          neLat: 37.7,
          neLng: 127.2,
        };

        const allPlacesInSeoul = await getPlaces(seoulBounds);
        console.log('Places API Response:', allPlacesInSeoul);
        // 이벤트가 있는 매장만 필터링 (MapContainer와 동일)
        const eventPlaces = allPlacesInSeoul.filter((p) => p.eventCode !== 'NONE');

        if (eventPlaces.length === 0) {
          setStores([]);
          setIsLoading(false);
          return;
        }

        // MapContainer와 동일한 방식으로 중심 좌표 사용
        const centerLatStr = '37.544581';
        const centerLngStr = '127.055961';

        const detailResults = await Promise.allSettled(
          eventPlaces.map((place) => getPlaceDetail(place.placeId, centerLatStr, centerLngStr))
        );

        const successfulDetails = detailResults
          .filter((result) => result.status === 'fulfilled' && result.value)
          .map((result) => (result as PromiseFulfilledResult<any>).value);

        detailResults.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(
              `상세 정보를 가져오는 데 실패했습니다 (placeId: ${eventPlaces[index].placeId}):`,
              result.reason
            );
          }
        });

        const finalStoreInfo = successfulDetails.map((detail) => {
          const originalPlace = eventPlaces.find((p) => p.placeId === detail.placeId)!;
          return {
            id: String(detail.placeId),
            name: detail.name,
            address: detail.address,
            hours: detail.hours,
            isBookmarked: detail.isBookmarked,
            status: detail.status as StoreStatusType,
            category: detail.category as CategoryType,
            event: detail.eventTypeCode as EventType,
            storeClass: originalPlace.markerCode as StoreClassType,
          };
        });

        // REQUIRE 이벤트 타입 매장을 제일 위로 정렬
        const sortedStores = finalStoreInfo.sort((a, b) => {
          if (a.event === 'REQUIRE' && b.event !== 'REQUIRE') {
            return -1; // a를 b보다 앞에 배치
          }
          if (a.event !== 'REQUIRE' && b.event === 'REQUIRE') {
            return 1; // b를 a보다 앞에 배치
          }
          return 0; // 순서 유지
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

  const handleBookmarkToggle = (storeId: string) => {
    setStores((prevStores) =>
      prevStores.map((store) =>
        store.id === storeId ? { ...store, isBookmarked: !store.isBookmarked } : store
      )
    );
  };

  if (isLoading) {
    return <div className="p-5 text-center text-gray-500">매장 목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-5 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="relative bg-white px-5">
      <div className="m-2 mb-4">
        <p className="text-lm font-bold text-black">이번주니어 매장</p>
      </div>
      <div className="flex flex-col items-start gap-4 mb-2">
        {stores.length > 0 ? (
          stores.map((store) => {
            const colorClass = getStoreNameColorClass(store.event);
            return (
              <BookmarkCard
                key={store.id}
                store={store}
                variant="full"
                nameColorClass={colorClass}
                onBookmarkToggle={() => handleBookmarkToggle(store.id)}
              />
            );
          })
        ) : (
          <div className="p-5 text-center text-gray-500">표시할 이벤트 매장이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default JuniorMarket;
