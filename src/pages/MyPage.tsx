import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import Grade from '@/components/common/Grade';
import MyPageNubiImage from '@/assets/my/mypagenubi.png';
import BookmarkButton from '@/components/common/BookmarkButton';
import CouponButton from '@/components/common/CouponBuuton';
import BackIcon from '@/assets/common/backIcon.svg?react';

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
          <div className="flex">
            {/* 캐릭터와 사용자 정보 */}
            <div className="flex gap-4 w-full">
              {/* 마이페이지 누비 캐릭터 */}
              <img src={MyPageNubiImage} alt="마이페이지 누비" className="w-[89px] h-[89px]" />

              {/* 사용자 정보 */}
              <div className="flex flex-col gap-2 mt-4 w-full">
                {/* 이름, 등급, 로그아웃 한 줄 */}
                <div className="flex justify-between w-full">
                  <div className="flex gap-2">
                    <h2 className="text-lm font-semibold text-black">유니어님</h2>
                    <div className="mt-0.5">
                      <Grade grade="VVIP" />
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-s font-regular text-gray-400 underline"
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
        {/* 멤버십 혜택 영역 */}
        <div className="mx-5 bg-gray-100 rounded-xl">
          <div className="px-5 py-5">
            {/* 멤버십 혜택 헤더 */}
            <div className="flex items-center gap-2 mb-3">
              <svg 
                width="25" 
                height="14" 
                viewBox="0 0 25 14" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                <path 
                  d="M23.5 7.75L23.5 1L16.75 1" 
                  stroke="#E6007E" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M23.5 1L15.561 8.939C15.4217 9.07839 15.2563 9.18896 15.0742 9.26441C14.8922 9.33985 14.6971 9.37868 14.5 9.37868C14.3029 9.37868 14.1078 9.33985 13.9258 9.26441C13.7437 9.18896 13.5783 9.07839 13.439 8.939L10.311 5.811C10.1717 5.67161 10.0063 5.56104 9.82425 5.48559C9.6422 5.41015 9.44706 5.37132 9.25 5.37132C9.05294 5.37132 8.8578 5.41015 8.67575 5.48559C8.4937 5.56104 8.3283 5.67161 8.189 5.811L1 13" 
                  stroke="#E6007E" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-m font-regular text-gray-700">멤버십혜택으로</span>
            </div>

            {/* 절약 내역 */}
            <div>
              <span className="text-lm font-semibold text-black">이번달 </span>
              <span className="text-lg font-semibold text-primary">21,200원</span>
              <span className="text-lm font-semibold text-black">을 절약했어요!</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="flex gap-[21px]">
            {/* 쿠폰 버튼 */}
            <CouponButton label="쿠폰 5개" onClick={() => console.log('쿠폰 클릭')} />

            {/* 즐겨찾기 버튼 */}
            <BookmarkButton label="즐겨찾기" onClick={() => console.log('즐겨찾기 클릭')} />
          </div>
        </div>
      </div>

      {/* 개인별 통계 영역 */}
      <div className="w-full bg-white mt-3 h-[284px]">
        <div className="px-5 py-6 ">
          {/* 헤더 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-lm font-semibold text-black">개인별 통계</span>
              <button type="button" className="flex items-center">
                <span className="text-m font-semibold text-black">자세히 보기</span>
                <BackIcon className="w-5 h-5 mb-0.5 text-black transform rotate-180" />
              </button>
            </div>
            <p className="text-m font-semibold text-gray-500">이번달 누적 할인액 21만원</p>
          </div>

          {/* 바 차트 */}
          <div className="flex justify-between items-end h-[160px] mt-7">
            {(() => {
              const chartData = [
                { month: '3월', value: 0 },
                { month: '4월', value: 30 },
                { month: '5월', value: 28 },
                { month: '6월', value: 42 },
                { month: '7월', value: 21, highlight: true },
              ];

              const maxValue = Math.max(...chartData.map((item) => item.value));
              const chartHeight = 120; // 차트 영역 최대 높이

              return chartData.map(({ month, value, highlight }, idx) => {
                const barHeight = maxValue > 0 ? (value / maxValue) * chartHeight : 4;

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 w-[50px]">
                    <span
                      className={`text-m font-semibold ${highlight ? 'text-primary' : 'text-black'}`}
                    >
                      {value}
                    </span>
                    <div
                      className={`rounded-t-lg w-8 ${highlight ? 'bg-primary' : 'bg-gray-500'}`}
                      style={{ height: `${Math.max(barHeight, 4)}px` }}
                    />
                    <span className="text-m font-semibold text-black">{month}</span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPage;
