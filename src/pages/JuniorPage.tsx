// src/pages/JuniorPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/common/Header';
import EventBanner from '@/components/JuniorPage/EventBanner';
import StampRouletteCard from '@/components/JuniorPage/StampRouletteCard';
import JuniorMap from '@/components/JuniorPage/JuniorMap';
import TodayCouponSection from '@/components/JuniorPage/TodayCouponSection';
import JuniorMarket from '@/components/JuniorPage/JuniorMarket';
import { getPlaces } from '@/apis/getPlaces'; // API 호출 함수
import type { Place } from '@/apis/getPlaces';
import type { StoreType, EventType } from '@/types/Junior';
import type {
  CategoryType,
  StoreClassType,
  StoreStatusType,
} from '@/components/common/StoreTypeIcon';

// API 응답 데이터(Place)를 페이지 전체에서 사용할 데이터 형태(ExtendedStoreType)로 변환
// isStamped, date는 API에 없는 값이므로 기본값을 설정해줍니다.
type ExtendedStoreType = StoreType & {
  isStamped: boolean;
  date?: string;
};

const convertPlaceToStore = (place: Place): ExtendedStoreType => {
  return {
    id: String(place.placeId),
    lat: place.latitude,
    lng: place.longitude,
    name: place.name,
    address: place.address,
    hours: '09:00 ~ 21:00', // API 응답에 따라 수정 필요
    status: '영업중' as StoreStatusType, // API 응답에 따라 수정 필요
    category: place.categoryCode as CategoryType,
    storeClass: place.markerCode as StoreClassType,
    event: place.eventCode as EventType,
    isBookmarked: place.favorite,
    coupons: [],
    isStamped: false, // API에 없으므로 기본값 false
    date: undefined, // API에 없으므로 기본값 undefined
  };
};

type Stamp = {
  name: string;
  isStamped: boolean;
  date?: string;
};

const JuniorPage = () => {
  // [수정] 초기 데이터를 빈 배열로 설정
  const [stores, setStores] = useState<ExtendedStoreType[]>([]);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // [수정] 컴포넌트 마운트 시 API를 호출하여 모든 이벤트 매장 데이터를 가져오는 로직
  useEffect(() => {
    const fetchAllEventStores = async () => {
      try {
        setIsLoading(true);
        // 대한민국 전체를 포함하는 넓은 좌표로 모든 매장 검색
        const allPlaces = await getPlaces({
          swLat: 33.0,
          swLng: 124.0,
          neLat: 39.0,
          neLng: 132.0,
        });

        // 이벤트가 있는 매장만 필터링
        const eventPlaces = allPlaces.filter((place) => place.eventCode !== 'NONE');

        // UI에서 사용할 데이터 형태로 변환
        const storeData = eventPlaces.map(convertPlaceToStore);
        setStores(storeData);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllEventStores();
  }, []); // 빈 배열을 전달하여 최초 1회만 실행

  // [수정] stores 데이터가 변경될 때마다 스탬프 데이터를 재계산
  useEffect(() => {
    if (stores.length === 0) return;

    const requiredStore = stores.find((store) => store.event === 'REQUIRE');
    const generalStores = stores.filter((store) => store.event === 'GENERAL');
    const newStamps: Stamp[] = [];

    if (requiredStore) {
      newStamps.push({
        name: requiredStore.isStamped ? requiredStore.name : '-',
        isStamped: requiredStore.isStamped,
        date: requiredStore.isStamped ? requiredStore.date : undefined,
      });
    } else {
      newStamps.push({ name: '-', isStamped: false });
    }

    const stampedGeneral = generalStores.filter((store) => store.isStamped);
    const unstampedGeneral = generalStores.filter((store) => !store.isStamped);
    stampedGeneral.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    const prioritizedGeneral = [...stampedGeneral, ...unstampedGeneral];

    for (let i = 0; i < 3; i++) {
      const storeForSlot = prioritizedGeneral[i];
      if (storeForSlot) {
        newStamps.push({
          name: storeForSlot.isStamped ? storeForSlot.name : '-',
          isStamped: storeForSlot.isStamped,
          date: storeForSlot.isStamped ? storeForSlot.date : undefined,
        });
      } else {
        newStamps.push({ name: '-', isStamped: false });
      }
    }
    setStamps(newStamps);
  }, [stores]);

  const handleBookmarkToggle = useCallback((storeId: string) => {
    // 이 부분도 추후에는 API 호출로 변경되어야 합니다.
    setStores((prevStores) =>
      prevStores.map((store) =>
        store.id === storeId ? { ...store, isBookmarked: !store.isBookmarked } : store
      )
    );
  }, []);

  if (isLoading) {
    return (
      <>
        <Header title="이번주니어" />
        <div className="p-10 text-center">매장 정보를 불러오는 중입니다...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="이번주니어" />
        <div className="p-10 text-center text-red-500">{error}</div>
      </>
    );
  }

  return (
    <>
      <Header title="이번주니어" />
      <div className="flex flex-col items-center">
        <EventBanner />
        <div className="flex flex-col gap-3 items-center w-full">
          <StampRouletteCard stamps={stamps} />
          {/* [수정] API로 받아온 stores 데이터를 자식 컴포넌트에 전달 */}
          <JuniorMap stores={stores} onBookmarkToggle={handleBookmarkToggle} />
          <TodayCouponSection />
          <JuniorMarket stores={stores} onBookmarkToggle={handleBookmarkToggle} />
        </div>
      </div>
    </>
  );
};

export default JuniorPage;
