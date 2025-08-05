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

// 스탬프 데이터 타입을 정의합니다.
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

  // 현재 진행 중인 이벤트 ID
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
        // 사용자 정보와 스탬프 상태를 동시에 API로 요청합니다.
        const [userInfo, stampStatus] = await Promise.all([
          getUserInfo(),
          getStampsStatus(currentEventId),
        ]);

        // ✨ --- 가장 중요한 로직 --- ✨
        // API 응답(userInfo)에서 rouletteResults 배열을 확인합니다.
        // `some` 메서드를 사용해, 현재 이벤트 ID와 일치하고 `participated`가 true인 기록이 있는지 확인합니다.
        const hasParticipated =
          userInfo.rouletteResults?.some(
            (result) => result.event.unearEventId === currentEventId && result.participated
          ) || false; // 기록이 없으면 false

        // 확인된 참여 여부(true 또는 false)를 상태에 저장합니다.
        setInitialIsSpun(hasParticipated);
        // ✨ --- 여기까지 --- ✨

        setIsRouletteAvailable(stampStatus.rouletteAvailable);

        // 스탬프 데이터를 가공합니다.
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
  }, [currentEventId]); // currentEventId가 변경될 때마다 데이터를 다시 가져옵니다.

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
          {/* ✨ 자식 컴포넌트에 `hasExistingResult` prop으로 참여 여부를 전달합니다. */}
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
