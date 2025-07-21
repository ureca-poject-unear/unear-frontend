import { useNavigate } from 'react-router-dom';
import BackIcon from '@/assets/common/backIcon.svg?react';
// 브랜드 이미지들
import CgvImage from '@/assets/MainPage/cgv.png';
import Gs25Image from '@/assets/MainPage/gs25.png';
import VipsImage from '@/assets/MainPage/vips.png';
import BaskinRabbinsImage from '@/assets/MainPage/baskinrabbins.png';
import LotteCinemaImage from '@/assets/MainPage/lottecinema.png';
import ParisBaguetteImage from '@/assets/MainPage/parisbaguette.jpg';
import SkRentalCarImage from '@/assets/MainPage/skrentalcar.png';
import TourLesJoursImage from '@/assets/MainPage/tourlesjours.png';

const MembershipBrandBanner = () => {
  const navigate = useNavigate();

  const handleMembershipClick = () => {
    navigate('/membership'); // 멤버십 페이지로 이동
  };

  return (
    <div
      className="w-full bg-white rounded-[20px] mt-3 p-5 pb-4"
      style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
    >
      {/* 멤버십 헤더 영역 */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-black font-bold text-lm leading-[18px]">멤버십 브랜드</h3>
        <button onClick={handleMembershipClick} className="flex items-center">
          <span className="text-black font-regular text-sm">전체 혜택 확인하기</span>
          <BackIcon className="w-4 h-4 mb-1 transform rotate-180 text-black" />
        </button>
      </div>

      {/* 서브 텍스트 */}
      <div className="mb-4">
        <p className="text-gray-500 font-regular text-sm leading-[14px]">할인을 확인해 보세요</p>
      </div>

      {/* 브랜드 로고 그리드 */}
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={CgvImage} alt="CGV" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={Gs25Image} alt="GS25" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={VipsImage} alt="VIPS" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img
            src={BaskinRabbinsImage}
            alt="배스킨라빈스"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={LotteCinemaImage} alt="롯데시네마" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={ParisBaguetteImage} alt="파리바게뜨" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={SkRentalCarImage} alt="SK렌터카" className="w-full h-full object-contain" />
        </div>
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-white border border-gray-200">
          <img src={TourLesJoursImage} alt="뚜레주르" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default MembershipBrandBanner;
