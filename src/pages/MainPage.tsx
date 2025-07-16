import React from 'react';
import ActionButton from '../components/common/ActionButton';
import LocationButton from '../components/common/LocationButton';
import CallButton from '../components/common/CallButton';

const MainPage = () => {
  const handleActionClick = () => {};

  const handleLocationClick = () => {
    console.log('위치 보기 버튼 클릭됨!');
  };

  const handleCallClick = () => {
    console.log('전화 하기 버튼 클릭됨!');
  };

  return (
    <div className="App">
      {/* 로그인/회원가입 공통 컴포넌트 */}
      <ActionButton text="로그인" onClick={handleActionClick} />

      {/* LocationButton 컴포넌트 */}
      <LocationButton onClick={handleLocationClick} />

      {/* CallButton 컴포넌트 */}
      <CallButton onClick={handleCallClick} />
    </div>
  );
};

export default MainPage;
