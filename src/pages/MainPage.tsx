import BarcodeIcon from '@/assets/common/barcode.svg?react';
import InformationIcon from '@/assets/common/information.svg?react';
import MainNubiImage from '@/assets/MainPage/mainnubi.png';
import EventBannerImage from '@/assets/MainPage/eventbanner.png';
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

  return (
    <>
      {/* 메인페이지 헤더 */}
      <header className="fixed top-0 left-0 w-full h-[40px] z-50">
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
          className="relative h-[114px] mt-4 bg-white rounded-[20px]"
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
            <img src={MainNubiImage} alt="메인 누비" className="w-[89px] h-[89px] object-contain" />
          </div>
        </div>

        {/* 이벤트 배너 */}
        <div className="mt-[12px] relative">
          {/* 이벤트 배너 이미지 */}
          <img src={EventBannerImage} alt="이벤트 배너" className="w-full h-auto object-cover" />

          {/* 이벤트 바로가기 텍스트 */}
          <button
            onClick={handleEventClick}
            className="absolute bottom-[18px] left-1/2 transform -translate-x-1/2"
          >
            <span className="text-sm font-semibold text-gray-500 underline">이벤트 바로가기</span>
          </button>
        </div>
      </main>

      {/* 바코드 바텀시트 */}
      <BottomSheetBarcode
        userName="유니aaa어"
        userGrade="VIP"
        barcodeValue="123456789"
        isOpen={isBarcodeSheetOpen}
        onClose={() => setIsBarcodeSheetOpen(false)}
        showButton={false}
      />
    </>
  );
};

export default MainPage;
