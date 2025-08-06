import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import LoadingScreen from '@/components/common/LoadingScreen';
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
  // ✨ 서버에서 받아온 사용자의 '초기' 룰렛 참여 여부를 저장하는 상태
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

        // ✨ API 응답에서 현재 이벤트(eventId: 2)에 참여한 기록이 있는지 확인
        const hasParticipated =
          userInfo.rouletteResults?.some(
            (result) => result.event.unearEventId === currentEventId && result.participated
          ) || false;

        // ✨ 확인된 참여 여부를 상태에 저장
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
        <div className="w-full max-w-[600px] mx-auto">
          <LoadingScreen
            fullHeight={false}
            message="이벤트 정보를 불러오는 중입니다..."
            size="md"
          />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="이번주니어" />
        <div className="w-full max-w-[600px] mx-auto">
          <div className="p-10 text-center text-red-500">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="이번주니어" />
      <div className="w-full max-w-[600px] mx-auto flex flex-col items-center">
        <EventBanner />
        <div className="flex flex-col gap-3 items-center w-full">
          {/* ✨ 자식 컴포넌트에 `hasExistingResult` prop으로 서버에서 확인한 참여 여부를 전달 */}
          <StampRouletteCard
            stamps={stamps}
            eventId={currentEventId}
            hasExistingResult={initialIsSpun}
            isRouletteEnabledByServer={isRouletteAvailable}
          />
          <JuniorMap />
          <TodayCouponSection />
          <JuniorMarket />
        </div>
      </div>
    </>
  );
};

export default JuniorPage;
