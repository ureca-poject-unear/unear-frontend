// src/pages/JuniorPage.tsx (수정된 코드)

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';

import EventBanner from '@/components/junior/EventBanner';
import StampRouletteCard from '@/components/junior/StampRouletteCard';
import JuniorMap from '@/components/junior/JuniorMap';
import TodayCouponSection from '@/components/junior/TodayCouponSection';
import JuniorMarket from '@/components/junior/JuniorMarket';

import { getStampsStatus, type StampSlot } from '@/apis/stamp';
import { getUserInfo } from '@/apis/user';

type Stamp = {
  name: string;
  isStamped: boolean;
  date?: string;
};

const JuniorPage = () => {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [isRouletteAvailable, setIsRouletteAvailable] = useState(false);
  const [initialIsSpun, setInitialIsSpun] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentEventId = 2;

  useEffect(() => {
    const fetchEventData = async () => {
      const token = sessionStorage.getItem('temp_access_token');
      if (!token) {
        setError('로그인이 필요한 서비스입니다.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const [userInfo, stampStatus] = await Promise.all([
          getUserInfo(),
          getStampsStatus(currentEventId),
        ]);

        console.log('API 응답 원본 (stampStatus):', stampStatus);
        console.log('-> rouletteAvailable 값:', stampStatus.rouletteAvailable);

        const hasParticipated =
          userInfo.rouletteResults?.some(
            (result) => result.event.unearEventId === currentEventId && result.participated
          ) || false;
        setInitialIsSpun(hasParticipated);
        setIsRouletteAvailable(stampStatus.rouletteAvailable);

        const newStamps: Stamp[] = stampStatus.stamps.map((slot: StampSlot) => ({
          name: slot.stamped ? slot.placeName : '-',
          isStamped: slot.stamped,
        }));

        const requiredStamp = newStamps.find((s) =>
          stampStatus.stamps.find(
            (slot) => slot.placeName === s.name && slot.eventCode === 'REQUIRE'
          )
        );
        const generalStamps = newStamps.filter((s) =>
          stampStatus.stamps.find(
            (slot) => slot.placeName === s.name && slot.eventCode === 'GENERAL'
          )
        );

        const finalStamps: Stamp[] = [];
        if (requiredStamp) finalStamps.push(requiredStamp);
        finalStamps.push(...generalStamps);

        setStamps(finalStamps);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [currentEventId]);

  if (isLoading) {
    return (
      <>
        <Header title="이번주니어" />
        <div className="p-10 text-center">이벤트 정보를 불러오는 중입니다...</div>
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
          <StampRouletteCard
            stamps={stamps}
            eventId={currentEventId}
            initialIsSpun={initialIsSpun}
            isRouletteEnabledByServer={isRouletteAvailable}
          />
          {/*
            [수정] JuniorMap 컴포넌트에 불필요한 props(stores, onBookmarkToggle) 전달 코드를 제거합니다.
            [이유] JuniorMap 컴포넌트는 더 이상 props를 받지 않도록 수정되었기 때문입니다.
          */}
          <JuniorMap />
          <TodayCouponSection />
          <JuniorMarket />
        </div>
      </div>
    </>
  );
};

export default JuniorPage;
