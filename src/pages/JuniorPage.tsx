import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/common/Header';
import EventBanner from '@/components/JuniorPage/EventBanner';
import StampRouletteCard from '@/components/JuniorPage/StampRouletteCard';
import JuniorMap from '@/components/JuniorPage/JuniorMap';
import TodayCouponSection from '@/components/JuniorPage/TodayCouponSection';
import JuniorMarket from '@/components/JuniorPage/JuniorMarket';
import type { StoreType } from '@/types/Junior';

// StoreType에 isStamped와 date 추가
type ExtendedStoreType = StoreType & {
  isStamped: boolean;
  date?: string;
};

// StampRouletteCard와 데이터 형식을 맞추기 위한 타입
type Stamp = {
  name: string;
  isStamped: boolean;
  date?: string;
};

const initialStores: ExtendedStoreType[] = [
  {
    id: 'marker1',
    lat: 37.545581,
    lng: 127.056961,
    name: '스타벅스 성수점',
    address: '서울 성동구 성수이로 118',
    hours: '07:00 - 22:00',
    category: 'CAFE',
    storeClass: 'BRAND',
    event: 'GENERAL',
    status: '영업중',
    isBookmarked: true,
    coupons: [],
    isStamped: true,
    date: '07.25',
  },
  {
    id: 'marker2',
    lat: 37.543581,
    lng: 127.054961,
    name: '성수밀도',
    address: '서울 성동구 서울숲2길 19-1',
    hours: '11:00 - 21:00',
    category: 'FOOD',
    storeClass: 'LOCAL',
    event: 'GENERAL',
    status: '영업중',
    isBookmarked: false,
    coupons: [],
    isStamped: true,
    date: '07.24',
  },
  {
    id: 'marker3',
    lat: 37.546081,
    lng: 127.053961,
    name: '포인트오브뷰 서울',
    address: '서울 성동구 연무장길 18',
    hours: '12:00 - 20:00',
    category: 'SHOPPING',
    storeClass: 'LOCAL',
    event: 'GENERAL',
    status: '휴무',
    isBookmarked: true,
    coupons: [],
    isStamped: true,
    date: '07.26',
  },
  {
    id: 'marker4',
    lat: 37.5428,
    lng: 127.0555,
    name: '대림창고',
    address: '서울 성동구 성수이로 78',
    hours: '11:00 - 23:00',
    category: 'CAFE',
    storeClass: 'LOCAL',
    event: 'REQUIRE',
    status: '영업중',
    isBookmarked: false,
    coupons: [],
    isStamped: true,
    date: '07.26',
  },
];

const JuniorPage = () => {
  const [stores, setStores] = useState<ExtendedStoreType[]>(initialStores);
  const [stamps, setStamps] = useState<Stamp[]>([]);

  // [수정] 스탬프 슬롯 개수(필수1, 일반3)를 보장하는 로직
  useEffect(() => {
    const requiredStore = stores.find((store) => store.event === 'REQUIRE');
    const generalStores = stores.filter((store) => store.event === 'GENERAL');

    const newStamps: Stamp[] = [];

    // --- 1. 필수 매장 슬롯 처리 (항상 1개) ---
    if (requiredStore) {
      newStamps.push({
        name: requiredStore.isStamped ? requiredStore.name : '-',
        isStamped: requiredStore.isStamped,
        date: requiredStore.isStamped ? requiredStore.date : undefined,
      });
    } else {
      // 필수 매장이 없으면 빈 슬롯으로 채웁니다.
      newStamps.push({ name: '-', isStamped: false });
    }

    // --- 2. 일반 매장 슬롯 처리 (항상 3개) ---
    const stampedGeneral = generalStores.filter((store) => store.isStamped);
    const unstampedGeneral = generalStores.filter((store) => !store.isStamped);

    // 스탬프 찍힌 순 -> 안 찍힌 순으로 정렬
    stampedGeneral.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    const prioritizedGeneral = [...stampedGeneral, ...unstampedGeneral];

    // 정렬된 목록에서 상위 3개만 사용하여 3개의 일반 슬롯을 채웁니다.
    for (let i = 0; i < 3; i++) {
      const storeForSlot = prioritizedGeneral[i];
      if (storeForSlot) {
        newStamps.push({
          name: storeForSlot.isStamped ? storeForSlot.name : '-',
          isStamped: storeForSlot.isStamped,
          date: storeForSlot.isStamped ? storeForSlot.date : undefined,
        });
      } else {
        // 3개를 채우기 전에 매장이 동나면 빈 슬롯으로 채웁니다.
        newStamps.push({ name: '-', isStamped: false });
      }
    }

    // 최종적으로 newStamps 배열은 항상 4개의 요소를 가집니다.
    setStamps(newStamps);
  }, [stores]);

  const handleBookmarkToggle = useCallback((storeId: string) => {
    setStores((prevStores) =>
      prevStores.map((store) =>
        store.id === storeId ? { ...store, isBookmarked: !store.isBookmarked } : store
      )
    );
  }, []);

  return (
    <>
      <Header title="이번주니어" />
      <div className="flex flex-col items-center">
        <EventBanner />
        <div className="flex flex-col gap-3 items-center w-full">
          <StampRouletteCard stamps={stamps} />
          <JuniorMap stores={stores} onBookmarkToggle={handleBookmarkToggle} />
          <TodayCouponSection />
          <JuniorMarket stores={stores} onBookmarkToggle={handleBookmarkToggle} />
        </div>
      </div>
    </>
  );
};

export default JuniorPage;
