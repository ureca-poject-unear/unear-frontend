import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import onboarding1 from '@/assets/onboarding/onboarding1.png';
import onboarding2 from '@/assets/onboarding/onboarding2.png';
import onboarding3 from '@/assets/onboarding/onboarding3.png';
import onboarding4 from '@/assets/onboarding/onboarding4.png';
import onboarding5 from '@/assets/onboarding/onboarding5.png';
import MiniButton from '@/components/common/MiniButton';
import 'swiper/css';

const OnboardingPage = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const contents = [
    {
      title: '내 주변 혜택, 한눈에',
      subtitle1: '쿠폰부터 필터, 로드뷰까지',
      subtitle2: '원하는 매장을 빠르게 찾아요',
      image: onboarding1,
    },
    {
      title: '혜택 매장을 지도로!',
      subtitle1: '마커를 눌러 매장 정보 확인',
      subtitle2: '내 주변 혜택을 쉽게 찾아요',
      image: onboarding2,
    },
    {
      title: '소비 습관, 스토리로',
      subtitle1: 'AI가 그려주는 소비 일기',
      subtitle2: '매달 나만의 감성적인 스토리가 생겨요',
      image: onboarding3,
    },
    {
      title: '이번주, 유니어 미션!',
      subtitle1: '다양한 미션 및 이벤트 참여',
      subtitle2: '매주 새롭게 열리는 혜택이 기다려요',
      image: onboarding4,
    },
    {
      title: '나의 소비 리포트',
      subtitle1: '나만의 데이터로 더 똑똑하게',
      subtitle2: '한 달 단위로 소비를 분석해드려요',
      image: onboarding5,
    },
  ];

  const handleComplete = () => {
    localStorage.setItem('hasOnboarded', 'true');
    navigate('/login');
  };

  return (
    <div className="w-full max-w-[600px] min-h-screen px-5 mx-auto relative">
      {/* 헤더 */}
      <header className="absolute top-0 left-0 w-full h-[40px] z-10">
        <div className="w-full max-w-[600px] pt-1 mx-auto px-5 h-full flex items-center justify-between">
          <h1 className="text-primary font-bold text-lg leading-[40px]">U:NEAR</h1>
        </div>
      </header>

      <div className="pt-[60px] pb-[40px] h-[calc(100vh-70px)]">
        <Swiper
          modules={[Mousewheel]}
          slidesPerView={1}
          onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
          mousewheel={{ forceToAxis: true }}
          className="w-full h-full"
        >
          {contents.map(({ title, subtitle1, subtitle2, image }, i) => (
            <SwiperSlide key={i}>
              {/* 슬라이드 내부를 flex column + center 정렬 */}
              <div className="flex flex-col justify-center items-start h-full text-left">
                <h2 className="text-xl font-semibold text-primary mb-2">{title}</h2>
                <p className="text-lm text-black">{subtitle1}</p>
                <p className="text-lm text-black mb-8">{subtitle2}</p>
                <div className="w-full flex justify-center">
                  <img src={image} alt="온보딩 이미지" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 페이지 인디케이터 */}
      <div className="absolute bottom-[68px] left-0 w-full flex justify-center">
        {contents.map((_, i) => (
          <div
            key={i}
            className={`w-[7px] h-[7px] rounded-full mx-[5px] ${index === i ? 'bg-primary' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-4 left-0 w-full px-5 flex justify-center">
        {index === contents.length - 1 ? (
          <MiniButton text="시작하기" onClick={handleComplete} isActive={true} />
        ) : (
          <button onClick={handleComplete} className="text-gray-400 underline text-sm">
            건너뛰기
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
