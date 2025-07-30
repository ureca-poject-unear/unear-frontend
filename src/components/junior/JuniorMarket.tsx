// src/app/(main)/junior-market/page.tsx

import { useState, useEffect } from 'react';

import BookmarkCard from '@/components/common/BookmarkCard';
import type { BookmarkStore } from '@/types/bookmark';
import type { Place } from '@/types/map';
import { getPlaces } from '@/apis/getPlaces';
import { getPlaceDetail } from '@/apis/getPlaceDetail';
import type { CategoryType, EventType, StoreClassType } from '@/components/common/StoreTypeIcon';

const JuniorMarket = () => {
  const [stores, setStores] = useState<BookmarkStore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

        const finalStoreInfo: BookmarkStore[] = successfulDetails.map((detail) => {
          const originalPlace = eventPlaces.find((p: Place) => p.placeId === detail.placeId)!;

          return {
            id: String(detail.placeId),
            name: detail.name,
            address: detail.address,
            hours: detail.hours,
            distance: detail.distance,
            isBookmarked: detail.isBookmarked,
            category: detail.category as CategoryType,
            event: detail.eventTypeCode as EventType,
            storeClass: originalPlace.markerCode as StoreClassType,
            phoneNumber: detail.tel,
            // Add benefit and coupon information
            benefitDesc: detail.benefitDesc,
            coupons: detail.coupons,
            status: detail.status, // Add store status
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
          stores.map((store) => (
            <BookmarkCard
              key={store.id}
              store={store}
              onBookmarkToggle={() => handleBookmarkToggle(store.id)}
              // Ensure the full variant is used to display all info
            />
          ))
        ) : (
          <div className="p-5 text-center text-gray-500">표시할 이벤트 매장이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default JuniorMarket;
