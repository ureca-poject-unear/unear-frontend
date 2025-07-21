import Grade from '../components/common/Grade';

import _404State from '@/components/common/404State';

import BarcodeIcon from '@/assets/common/barcode.svg?react';
import InformationIcon from '@/assets/common/information.svg?react';
import MainNubiImage from '@/assets/MainPage/mainnubi.svg?react';
import EventBannerImage from '@/assets/MainPage/eventbanner.png';
import StoryBackgroundImage from '@/assets/MainPage/storyBackground.png';
import StoryNubiImage from '@/assets/MainPage/storynubi.svg?react';

import BottomSheetBarcode from '@/components/common/BottomSheetBarcode';
import MembershipBrandBanner from '@/components/MainPage/MembershipBrandBanner';
import MembershipBenefitModal from '@/components/MainPage/MembershipBenefitModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [isBarcodeSheetOpen, setIsBarcodeSheetOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleBarcodeClick = () => {
    setIsBarcodeSheetOpen(true);
  };

  const handleInformationClick = () => {
    setIsMembershipModalOpen(true);
  };

  const handleEventClick = () => {
    navigate('/junior'); // 이번주니어 페이지로 이동
  };

  const handleStoryClick = () => {
    navigate('/story'); // 스토리 페이지로 이동
  };

  return (
    <>
      {/* 메인페이지 헤더 */}
      <header className="absolute top-0 left-0 w-full h-[40px] bg-background">
        <div className="w-full max-w-[393px] pt-1 mx-auto px-5 h-full flex items-center justify-between">
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
          className="w-full bg-white rounded-[20px] mt-3 pl-6 pt-3 pb-3 flex items-center justify-between"
          style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
        >
          <div className="flex flex-col gap-3">
            {/* 사용자 인사말 */}
            <h2 className="text-black font-semibold text-lm leading-[18px]">
              유니어님 안녕하세요!
            </h2>

            {/* 사용자 등급과 정보 아이콘 */}
            <div className="flex items-center gap-2">
              <Grade grade="VVIP" />
              <button
                onClick={handleInformationClick}
                className="text-gray-400"
                aria-label="등급 정보"
                type="button"
              >
                <InformationIcon width={16} height={16} />
              </button>
            </div>
          </div>

          {/* 메인 누비 이미지 */}
          <div className="flex-shrink-0">
            <MainNubiImage className="w-[89px] h-[89px]" />
          </div>
        </div>

        {/* 이벤트 배너 */}
        <div className="mt-3 relative rounded-[20px] overflow-hidden">
          <img src={EventBannerImage} alt="이벤트 배너" className="w-full h-[353px] object-cover" />

          {/* 이벤트 바로가기 오버레이 */}
          <div className="absolute inset-0 flex items-end justify-center pb-[18px]">
            <button onClick={handleEventClick}>
              <span className="text-sm font-semibold text-gray-500 underline">이벤트 바로가기</span>
            </button>
          </div>
        </div>

        {/* 스토리 배너 */}
        <div
          className="w-full mt-3 pl-6 pt-3 pb-3 rounded-[20px] overflow-hidden flex items-center justify-between"
          style={{
            backgroundImage: `url(${StoryBackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div className="flex-col gap-2">
            {/* 스토리 텍스트 */}
            <h3 className="text-white font-semibold mb-2 text-sm leading-[16px]">
              AI가 분석한
              <br />
              나만의 스토리를 확인해보세요!
            </h3>

            {/* 스토리 바로가기 텍스트 */}
            <button onClick={handleStoryClick}>
              <span className="text-gray-300 font-semibold text-s underline">스토리 바로가기</span>
            </button>
          </div>

          {/* 스토리 누비 이미지 */}
          <div className="flex-shrink-0">
            <StoryNubiImage className="w-[89px] h-[89px]" />
          </div>
        </div>

        {/* 다양한 멤버십 브랜드 배너 */}
        <MembershipBrandBanner />
      </main>

      {/* 바코드 바텀시트 */}
      <BottomSheetBarcode
        userName="유니어"
        userGrade="VVIP"
        barcodeValue="123456789"
        isOpen={isBarcodeSheetOpen}
        onClose={() => setIsBarcodeSheetOpen(false)}
      />

      {/* 멤버십 혜택 안내 모달 */}
      <MembershipBenefitModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
      />
    </>
  );
};

export default MainPage;
