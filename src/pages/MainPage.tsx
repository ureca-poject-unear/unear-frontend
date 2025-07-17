import React from 'react';
import ActionButton from '../components/common/ActionButton';
import LocationButton from '../components/common/LocationButton';
import CallButton from '../components/common/CallButton';
import PhoneIcon from '../components/common/PhoneButton';
import CouponButton from '../components/common/CouponBuuton';
import BookmarkButton from '../components/common/BookmarkButton';
import MiniButton from '../components/common/MiniButton';
import ToggleButton from '../components/common/ToggleButton';
import FilterButton from '../components/common/FilterButton';
import ConfirmButton from '../components/common/ConfirmButton';
import MiniLocationButton from '../components/common/MiniLocationButton';
import PhoneButtonDark from '../components/common/PhoneButtonDark';
import StoryButton from '../components/common/StoryButton';
const MainPage = () => {
  const handleActionClick = () => {};

  const handleMiniButtonClick = () => {
    console.log('버튼이 클릭되었습니다!');
  };
  const handleLocationClick = () => {
    console.log('위치 보기 버튼 클릭됨!');
  };

  const handleCallClick = () => {
    console.log('전화 하기 버튼 클릭됨!');
  };

  const handlePhoneClick = () => {
    console.log('전화 하기 버튼 클릭됨!');
  };
  const handleCouponButtonClick = () => {
    console.log('쿠폰 버튼 클릭됨!');
  };
  const handleBookmarkButtonClick = () => {
    console.log('즐겨찾기 버튼 클릭됨!');
  };

  return (
    <div className="App">
      {/* 로그인/회원가입 공통 컴포넌트 */}
      <ActionButton text="로그인" onClick={handleActionClick} />

      {/* LocationButton 컴포넌트 */}
      <LocationButton onClick={handleLocationClick} />

      {/* CallButton 컴포넌트 */}
      <CallButton onClick={handleCallClick} />

      <PhoneIcon onClick={handlePhoneClick} />
      <CouponButton onClick={handleCouponButtonClick} />
      <BookmarkButton onClick={handleBookmarkButtonClick} />
      <MiniButton text="룰렛 돌리기" onClick={handleMiniButtonClick} />
      <ToggleButton text="남자" />
      <FilterButton text="카페" />
      <ConfirmButton text="이메일 인증" />
      <MiniLocationButton />
      <PhoneButtonDark />
      <StoryButton text="소비 스토리 보기" />
    </div>
  );
};

export default MainPage;
