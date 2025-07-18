import Header from '@/components/common/Header';
import BottomSheetMain from '@/pages/BottomSheetMain';

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
import Grade from '../components/common/Grade';
import GradeMini from '../components/common/GradeMini';

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
    <>
      <Header title="메인페이지" />

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
        <Grade grade="우수" />
        <GradeMini grade="VIP" />
      </div>

      {/* 스타일 테스트용 UI */}
      <div className="">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-lg font-bold mb-2 text-primary">U:NEAR 프론트엔드 프로젝트</h1>

          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-m font-thin text-primary">Thin - LGEIHeadline‑Thin</h2>
            <h2 className="text-m font-light text-primary">Light - LGEIHeadline‑Light</h2>
            <h2 className="text-m font-regular font-normal text-primary">
              Regular - LGEIHeadline‑Regular
            </h2>
            <h2 className="text-m font-semibold text-primary">Semibold - LGEIHeadline‑Semibold</h2>
            <h2 className="text-m font-bold text-primary">Bold - LGEIHeadline‑Bold</h2>
          </div>

          <p className="mt-8 text-sm font-bold text-black mb-6">스타일 테스트</p>
          <div className="w-24 h-24 bg-storeicon rounded-full mx-auto mb-6" />
          <div className="w-32 h-12 bg-store rounded-[12px] mx-auto mb-6" />

          <button className="bg-primary text-white px-6 py-2 rounded-[12px] text-lm">
            테스트 버튼
          </button>
        </div>

        <BottomSheetMain />
      </div>
    </>
  );
};

export default MainPage;
