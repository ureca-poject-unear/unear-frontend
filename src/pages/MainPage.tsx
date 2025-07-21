import BarcodeIcon from '@/assets/common/barcode.svg?react';
import InformationIcon from '@/assets/common/information.svg?react';
import BackIcon from '@/assets/common/backIcon.svg?react';
import MainNubiImage from '@/assets/MainPage/mainnubi.svg?react';
import EventBannerImage from '@/assets/MainPage/eventbanner.png';
import StoryBackgroundImage from '@/assets/MainPage/storyBackground.png';
import StoryNubiImage from '@/assets/MainPage/storynubi.svg?react';
// 브랜드 이미지들
import CgvImage from '@/assets/MainPage/cgv.png';
import Gs25Image from '@/assets/MainPage/gs25.png';
import VipsImage from '@/assets/MainPage/vips.png';
import BaskinRabbinsImage from '@/assets/MainPage/baskinrabbins.png';
import LotteCinemaImage from '@/assets/MainPage/lottecinema.png';
import ParisBaguetteImage from '@/assets/MainPage/parisbaguette.jpg';
import SkRentalCarImage from '@/assets/MainPage/skrentalcar.png';
import TourLesJoursImage from '@/assets/MainPage/tourlesjours.png';
import Grade from '@/components/common/Grade';
import BottomSheetBarcode from '@/components/common/BottomSheetBarcode';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [isBarcodeSheetOpen, setIsBarcodeSheetOpen] = useState(false);
  const navigate = useNavigate();

  const handleBarcodeClick = () => {
    setIsBarcodeSheetOpen(true);
  };

  const handleEventClick = () => {
    navigate('/junior'); // 이번주니어 페이지로 이동
  };

  const handleStoryClick = () => {
    navigate('/story'); // 스토리 페이지로 이동
  };

  const handleMembershipClick = () => {
    navigate('/membership'); // 멤버십 페이지로 이동
  };

  return (
    <>
      {/* 메인페이지 헤더 */}
      <header className="absolute top-0 left-0 w-full h-[40px] bg-background">
        <div className="w-full max-w-[393px] mx-auto px-5 h-full flex items-center justify-between">
          {/* U:NEAR 로고 */}
          <h1 className="text-primary font-bold text-lg leading-[40px]">U:NEAR</h1>

          {/* 바코드 아이콘 */}
          <button
            onClick={handleBarcodeClick}
            className="text-black"
            aria-label="바코드"
            type="button"
          >
            <BarcodeIcon width={24} height={24} />
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main>
        {/* 사용자 카드 */}
        <div
          className="relative h-[114px] mt-3 bg-white rounded-[20px]"
          style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
        >
          {/* 사용자 인사말 */}
          <div className="absolute left-7 top-[32px]">
            <h2 className="text-black font-semibold text-lm leading-[18px]">
              유니어님 안녕하세요!
            </h2>
          </div>

          {/* 사용자 등급과 정보 아이콘 */}
          <div className="absolute left-7 top-[63px] flex items-center gap-2">
            <Grade grade="VVIP" />
            <button className="text-gray-400" aria-label="등급 정보" type="button">
              <InformationIcon width={16} height={16} />
            </button>
          </div>

          {/* 메인 누비 이미지 */}
          <div className="absolute right-1 top-[13px]">
            <MainNubiImage className="w-[89px] h-[89px]" />
          </div>
        </div>

        {/* 이벤트 배너 */}
        <div className="mt-3 relative rounded-[20px] overflow-hidden">
          {/* 이벤트 배너 이미지 */}
          <img src={EventBannerImage} alt="이벤트 배너" className="w-full h-[353px] object-cover" />

          {/* 이벤트 바로가기 텍스트 */}
          <button
            onClick={handleEventClick}
            className="absolute bottom-[18px] left-1/2 transform -translate-x-1/2"
          >
            <span className="text-sm font-semibold text-gray-500 underline">이벤트 바로가기</span>
          </button>
        </div>

        {/* 스토리 배너 */}
        <div
          className="relative w-full h-[114px] mt-1 rounded-[20px] overflow-hidden"
          style={{
            backgroundImage: `url(${StoryBackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* 스토리 텍스트 */}
          <div className="absolute left-5 top-[32px]">
            <h3 className="text-white font-semibold text-sm leading-[14px]">
              AI가 분석한 나만의 스토리를 확인해보세요!
            </h3>
          </div>

          {/* 스토리 바로가기 텍스트 */}
          <div className="absolute left-5 top-[63px]">
            <button onClick={handleStoryClick}>
              <span className="text-gray-300 font-semibold text-s underline">스토리 바로가기</span>
            </button>
          </div>

          {/* 스토리 누비 이미지 */}
          <div className="absolute right-1 top-[13px]">
            <StoryNubiImage className="w-[89px] h-[89px]" />
          </div>
        </div>

        {/* 멤버십 브랜드 소개 배너 */}
        <div
          className="relative w-full h-[250px] mt-3 bg-white rounded-[20px]"
          style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
        >
          {/* 멤버십 헤더 영역 */}
          <div className="absolute left-3 top-[18px] right-3 flex items-center justify-between">
            <h3 className="text-black font-bold text-lm">다양한 멤버십 브랜드</h3>
            <button onClick={handleMembershipClick} className="flex items-center">
              <span className="text-black font-regular text-sm">전체 혜택 확인하기</span>
              <BackIcon className="w-4 h-4 mb-1 transform rotate-180 text-black" />
            </button>
          </div>

          {/* 서브 텍스트 */}
          <div className="absolute left-3 top-[50px]">
            <p className="text-gray-500 font-regular text-sm leading-[14px]">
              할인을 확인해 보세요
            </p>
          </div>

          {/* 브랜드 로고 그리드 */}
          <div className="absolute left-3 right-3 top-[78px] grid grid-cols-4 gap-4 justify-items-center">
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
              <img src={CgvImage} alt="CGV" className="w-full h-full object-contain" />
            </div>
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
              <img src={Gs25Image} alt="GS25" className="w-full h-full object-contain" />
            </div>
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
              <img src={VipsImage} alt="VIPS" className="w-full h-full object-contain" />
            </div>
            <div className="flex justify-center">
              <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
                <img
                  src={BaskinRabbinsImage}
                  alt="배스킨라빈스"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
                <img
                  src={LotteCinemaImage}
                  alt="롯데시네마"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
                <img
                  src={ParisBaguetteImage}
                  alt="파리바게뜨"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
                <img
                  src={SkRentalCarImage}
                  alt="SK렌터카"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
                <img
                  src={TourLesJoursImage}
                  alt="뚜레주르"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 바코드 바텀시트 */}
      <BottomSheetBarcode
        userName="유니어"
        userGrade="VVIP"
        barcodeValue="123456789"
        isOpen={isBarcodeSheetOpen}
        onClose={() => setIsBarcodeSheetOpen(false)}
      />
    </>
  );
};

export default MainPage;
