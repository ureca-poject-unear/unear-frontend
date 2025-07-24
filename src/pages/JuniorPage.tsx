import React, { useState, useEffect } from 'react'; // [추가] useState, useEffect 임포트
import Header from '@/components/common/Header';
import EventBanner from '@/components/JuniorPage/EventBanner';
import StampRouletteCard from '@/components/JuniorPage/StampRouletteCard';
import JuniorMap from '@/components/JuniorPage/JuniorMap';
import TodayCouponSection from '@/components/JuniorPage/TodayCouponSection';
import JuniorMarket from '@/components/JuniorPage/JuniorMarket';

// --- 실제로는 별도의 api 파일에 있을 함수들의 예시입니다 ---
// [추가] 사용자의 룰렛 참여 여부를 서버에서 가져오는 API 함수 (가상)
const fetchUserSpunStatus = async (): Promise<boolean> => {
  console.log('서버에서 사용자의 룰렛 참여 여부를 확인합니다...');
  // 실제로는 여기서 fetch나 axios를 사용해 API를 호출합니다.
  // 이 예시에서는 1초 후에 '아직 참여 안 함(false)'을 반환하도록 시뮬레이션합니다.
  return new Promise((resolve) => setTimeout(() => resolve(false), 1000));
};

// [추가] 사용자의 룰렛 참여 상태를 서버에 업데이트하는 API 함수 (가상)
const updateUserSpunStatus = async (hasSpun: boolean): Promise<void> => {
  console.log(`서버에 룰렛 참여 상태를 '${hasSpun}'으로 업데이트 요청합니다.`);
  // 실제로는 여기서 fetch나 axios를 사용해 API를 호출합니다.
  return new Promise((resolve) => setTimeout(resolve, 500));
};
// --- 여기까지 API 함수 예시입니다 ---

const sampleStamps = [
  { name: 'GS25', isStamped: true, date: '07.21' },
  { name: 'CU', isStamped: true, date: '07.22' },
  { name: '이마트24', isStamped: true, date: '07.23' },
  { name: '세븐일레븐', isStamped: true, date: '07.24' },
];

const JuniorPage = () => {
  // [추가] 룰렛 참여 여부를 관리하는 state
  const [hasSpun, setHasSpun] = useState(false);
  // [추가] 초기 데이터 로딩 상태를 관리하는 state
  const [isLoading, setIsLoading] = useState(true);

  // [추가] 컴포넌트가 처음 마운트될 때, 사용자의 룰렛 참여 상태를 가져옴
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userHasSpun = await fetchUserSpunStatus();
        setHasSpun(userHasSpun);
      } catch (error) {
        console.error('룰렛 참여 상태 조회 중 오류 발생:', error);
        // 에러가 발생해도 로딩은 끝나야 하므로 finally 블록 사용
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []); // 빈 배열을 전달하여 최초 1회만 실행

  // [추가] 룰렛 돌리기 버튼 클릭 시 실행될 함수
  const handleRouletteSpin = async () => {
    try {
      // 서버에 참여 상태 업데이트 요청
      await updateUserSpunStatus(true);
      // 요청 성공 시, 화면의 상태도 즉시 변경하여 UI 갱신
      setHasSpun(true);
      console.log('룰렛 참여가 완료되어 상태가 업데이트되었습니다.');
    } catch (error) {
      console.error('룰렛 상태 업데이트 실패:', error);
      // 여기에 실패 시 사용자에게 보여줄 알림 로직을 추가할 수 있습니다.
    }
  };

  // [추가] 로딩 중일 때 보여줄 UI
  if (isLoading) {
    return (
      <>
        <Header title="이번주니어" />
        <div>데이터를 불러오는 중입니다...</div>
      </>
    );
  }

  return (
    <>
      <Header title="이번주니어" />
      <EventBanner />
      <div className="flex flex-col gap-3">
        <StampRouletteCard
          stamps={sampleStamps}
          onRouletteClick={handleRouletteSpin} // [수정] 직접 만든 핸들러 함수를 전달
          hasAlreadySpun={hasSpun} // [추가] 참여 여부 상태를 prop으로 전달
        />
        <JuniorMap />
        <TodayCouponSection />
        <JuniorMarket />
      </div>
    </>
  );
};

export default JuniorPage;
