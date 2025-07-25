// src/pages/JuniorPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/common/Header';
import EventBanner from '@/components/JuniorPage/EventBanner';
import StampRouletteCard from '@/components/JuniorPage/StampRouletteCard';
import JuniorMap from '@/components/JuniorPage/JuniorMap';
import TodayCouponSection from '@/components/JuniorPage/TodayCouponSection';
import JuniorMarket from '@/components/JuniorPage/JuniorMarket';
import type { StoreType } from '@/types/Junior'; // [수정] 임포트 경로 변경

// --- API 함수 예시 (실제로는 별도 파일로 분리) ---
const fetchUserSpunStatus = async (): Promise<boolean> => {
  console.log('서버에서 사용자의 룰렛 참여 여부를 확인합니다...');
  return new Promise((resolve) => setTimeout(() => resolve(false), 1000));
};

const updateUserSpunStatus = async (hasSpun: boolean): Promise<void> => {
  console.log(`서버에 룰렛 참여 상태를 '${hasSpun}'으로 업데이트 요청합니다.`);
  return new Promise((resolve) => setTimeout(resolve, 500));
};
// --- API 함수 예시 종료 ---

// 샘플 스탬프 데이터
const sampleStamps = [
  { name: 'GS25', isStamped: true, date: '07.21' },
  { name: 'CU', isStamped: true, date: '07.22' },
  { name: '이마트24', isStamped: true, date: '07.23' },
  { name: '세븐일레븐', isStamped: true, date: '07.24' },
];

// 모든 매장 정보를 한 곳에서 관리하는 초기 데이터
const initialStores: StoreType[] = [
  {
    id: 'marker1',
    lat: 37.545581,
    lng: 127.056961,
    name: '스타벅스 성수점',
    address: '서울 성동구 성수이로 118',

    hours: '07:00 - 22:00',
    category: 'CAFE',
    storeClass: 'BRAND',
    event: 'REQUIRE',
    status: '영업중',
    isBookmarked: true,
    coupons: [],
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
  },
];

const JuniorPage = () => {
  // 룰렛 상태 관리
  const [hasSpun, setHasSpun] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 매장 데이터 상태 관리
  const [stores, setStores] = useState<StoreType[]>(initialStores);

  // 룰렛 참여 여부 조회 useEffect
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userHasSpun = await fetchUserSpunStatus();
        setHasSpun(userHasSpun);
      } catch (error) {
        console.error('룰렛 참여 상태 조회 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  // 북마크 상태 변경 핸들러
  const handleBookmarkToggle = useCallback((storeId: string) => {
    setStores((prevStores) =>
      prevStores.map((store) =>
        store.id === storeId ? { ...store, isBookmarked: !store.isBookmarked } : store
      )
    );
  }, []);

  // 룰렛 돌리기 핸들러
  const handleRouletteSpin = async () => {
    try {
      await updateUserSpunStatus(true);
      setHasSpun(true);
      console.log('룰렛 참여가 완료되어 상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('룰렛 상태 업데이트 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header title="이번주니어" />
        <div className="p-4 flex justify-center items-center">데이터를 불러오는 중입니다...</div>
      </>
    );
  }

  return (
    <>
      <Header title="이번주니어" />
      <div className="flex flex-col items-center">
        <EventBanner />
        <div className="flex flex-col gap-3 items-center w-full">
          <StampRouletteCard
            stamps={sampleStamps}
            onRouletteClick={handleRouletteSpin}
            hasAlreadySpun={hasSpun}
          />
          <JuniorMap stores={stores} onBookmarkToggle={handleBookmarkToggle} />
          <TodayCouponSection />
          <JuniorMarket stores={stores} onBookmarkToggle={handleBookmarkToggle} />
        </div>
      </div>
    </>
  );
};

export default JuniorPage;
