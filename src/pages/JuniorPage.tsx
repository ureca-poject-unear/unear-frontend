import React from 'react';
import Header from '@/components/common/Header';
import EventBanner from '@/components/JuniorPage/EventBanner';
import StampRouletteCard from '@/components/JuniorPage/StampRouletteCard';

const sampleStamps = [
  { name: '매장1', isStamped: true, date: '07.21' },
  { name: '매장1', isStamped: true, date: '07.21' },
  { name: '매장1', isStamped: true, date: '07.21' },
  { name: '매장1', isStamped: true, date: '07.21' },
];

const JuniorPage = () => {
  return (
    <>
      <Header title="이번주니어" />
      <EventBanner />
      <StampRouletteCard
        stamps={sampleStamps}
        onRouletteClick={() => {
          // 룰렛 돌리기 로직 작성
          console.log('룰렛 버튼 클릭됨!');
        }}
      />
    </>
  );
};

export default JuniorPage;
