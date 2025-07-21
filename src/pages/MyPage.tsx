import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import Grade from '@/components/common/Grade';
import MyPageNubiImage from '@/assets/MyPage/mypagenubi.png';
import GrowUpIcon from '@/assets/MyPage/growup.svg?react';
import CouponIcon from '@/assets/common/couponIcon.svg?react';
import StarIcon from '@/assets/common/iconStarFilled.svg?react';

const MyPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    // 로그아웃 기능 구현
    console.log('로그아웃 실행');
  };

  return (
    <>
      <Header title="마이 페이지" onBack={handleBack} />

      {/* 사용자 정보 영역 */}
      <div className="w-full bg-white">
        <div className="px-5 py-6">
          <div className="flex items-start">
            {/* 캐릭터와 사용자 정보 */}
            <div className="flex items-start gap-4">
              {/* 마이페이지 누비 캐릭터 */}
              <img src={MyPageNubiImage} alt="마이페이지 누비" className="w-[89px] h-[89px]" />

              {/* 사용자 정보 */}
              <div className="flex flex-col gap-1">
                {/* 이름, 등급, 로그아웃 한 줄 */}
                <div className="flex items-center gap-2">
                  <h2 className="text-lm font-semibold text-black">유니어님</h2>
                  <Grade grade="VVIP" />
                  <button
                    onClick={handleLogout}
                    className="text-s font-regular text-gray-400 underline ml-auto"
                    type="button"
                  >
                    로그아웃
                  </button>
                </div>

                {/* 인사말 */}
                <p className="text-m font-regular text-gray-400">오늘도 알뜰한 하루 되세요! ✨</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 멤버십 혜택 영역 */}
      <div className="w-full bg-gray-100">
        <div className="px-5 py-5">
          {/* 멤버십 혜택 헤더 */}
          <div className="flex items-center gap-2 mb-3">
            <GrowUpIcon className="w-6 h-6 text-gray-700" />
            <span className="text-m font-regular text-gray-700">멤버십혜택으로</span>
          </div>

          {/* 절약 내역 */}
          <div className="mb-5">
            <span className="text-lm font-semibold text-black">이번달 </span>
            <span className="text-lg font-semibold text-primary">21,200원</span>
            <span className="text-lm font-semibold text-black">을 절약했어요!</span>
          </div>

          {/* 쿠폰과 즐겨찾기 박스 */}
          <div className="flex gap-[21px]">
            {/* 쿠폰 박스 */}
            <div className="flex-1 h-[100px] border border-gray-400 rounded-lg bg-white flex flex-col items-center justify-center gap-2">
              <CouponIcon className="w-8 h-8" />
              <span className="text-lm font-semibold text-black">쿠폰 5개</span>
            </div>

            {/* 즐겨찾기 박스 */}
            <div className="flex-1 h-[100px] border border-gray-400 rounded-lg bg-white flex flex-col items-center justify-center gap-2">
              <StarIcon className="w-8 h-8 text-primary" />
              <span className="text-lm font-semibold text-black">즐겨찾기</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPage;
