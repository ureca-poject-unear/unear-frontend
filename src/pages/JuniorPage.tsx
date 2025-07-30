// src/pages/JuniorPage.tsx (수정된 최종 코드)

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/common/Header';

import EventBanner from '@/components/junior/EventBanner';
import StampRouletteCard from '@/components/junior/StampRouletteCard';
import JuniorMap from '@/components/junior/JuniorMap';
import TodayCouponSection from '@/components/junior/TodayCouponSection';
import JuniorMarket from '@/components/junior/JuniorMarket';

import type { Place } from '@/types/map';
import { getPlaces } from '@/apis/getPlaces';

import type {
  StoreType,
  EventType,
  CategoryType,
  StoreClassType,
  StoreStatusType,
} from '@/types/Junior';

type ExtendedStoreType = StoreType & {
  isStamped: boolean;
  date?: string;
};

const convertPlaceToStore = (place: Place): ExtendedStoreType => {
  return {
    id: String(place.placeId),
    lat: place.latitude,
    lng: place.longitude,
    name: place.placeName,
    address: '주소 정보 없음', // Place 타입에 주소가 없으므로 임시 처리
    hours: '09:00 ~ 21:00',
    status: '영업중' as StoreStatusType,
    category: place.categoryCode as CategoryType,
    storeClass: place.markerCode as StoreClassType,
    event: place.eventCode as EventType,
    isBookmarked: place.favorite,
    coupons: [],
    isStamped: false,
    date: undefined,
  };
};

type Stamp = {
  name: string;
  isStamped: boolean;
  date?: string;
};

const JuniorPage = () => {
  const [stores, setStores] = useState<ExtendedStoreType[]>([]);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllEventStores = async () => {
      try {
        setIsLoading(true);
        const allPlaces = await getPlaces({
          swLat: 33.0,
          swLng: 124.0,
          neLat: 39.0,
          neLng: 132.0,
        });

        const eventPlaces = allPlaces.filter((place) => place.eventCode !== 'NONE');
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
  }, []);

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
          <JuniorMap stores={stores} onBookmarkToggle={handleBookmarkToggle} />
          <TodayCouponSection />
          {/*
            [수정] JuniorMarket은 자체적으로 데이터를 로드하고 상태를 관리하므로
            아무런 props도 전달하지 않습니다.
          */}
          <JuniorMarket />
        </div>
      </div>
    </>
  );
};

export default JuniorPage;
