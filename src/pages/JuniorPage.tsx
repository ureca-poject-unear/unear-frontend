import React from 'react';
import Header from '@/components/common/Header';
import EventBanner from '@/components/JuniorPage/EventBanner';
import StampRouletteCard from '@/components/JuniorPage/StampRouletteCard';
import JuniorMap from '@/components/JuniorPage/JuniorMap';
import TodayCouponSection from '@/components/JuniorPage/TodayCouponSection';
import JuniorMarket from '@/components/JuniorPage/JuniorMarket';

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
      <div className="flex flex-col gap-3">
        <StampRouletteCard
          stamps={sampleStamps}
          onRouletteClick={() => {
            console.log('룰렛 버튼 클릭됨!');
          }}
        />
        <JuniorMap />
        <TodayCouponSection />
        <JuniorMarket />
      </div>
    </>
  );
};

export default JuniorPage;
