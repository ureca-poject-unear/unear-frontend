import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StoryDetailLayout from '@/components/story/StoryDetailLayout';
import PaymentCard from '@/components/story/PaymentCard';

interface StoryType {
  id: number;
  date: string;
  title: string;
  price: string;
  imageSrc: string;
  message: string;
}

export default function StoryDetailPage() {
  const navigate = useNavigate();

  const dummyStories: StoryType[] = [
    {
      id: 1,
      date: '2025.07.04',
      title: '장충동 왕족발보쌈',
      price: '30,000원',
      imageSrc: '/assets/delivery.png',
      message: '맛있는 음식 도착 소식에,\n행복해지는 순간이 찾아왔어.',
    },
    {
      id: 2,
      date: '2025.07.13',
      title: 'CGV',
      price: '12,000원',
      imageSrc: '/assets/popcorn.png',
      message: '영화관 불빛 아래,\n설레는 마음이 가득해.',
    },
    {
      id: 3,
      date: '2025.07.22',
      title: '스타벅스',
      price: '4,500원',
      imageSrc: '/assets/coffee.png',
      message: '시원한 커피 한 잔과\n느긋한 오후의 시간.',
    },
    {
      id: 4,
      date: '2025.07.26',
      title: '배스킨라빈스',
      price: '4,500원',
      imageSrc: '/assets/icecream.png',
      message: '달콤한 아이스크림이\n더위를 잊게 해줘.',
    },
  ];

  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentStoryData = dummyStories[currentStory] ?? dummyStories[0];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (progress < 100) return;

    if (currentStory < dummyStories.length - 1) {
      setCurrentStory((prev) => prev + 1);
      setProgress(0);
      setIsPlaying(true);
    } else {
      navigate('/story/end', { state: { stories: dummyStories } });
    }
  }, [progress, currentStory, dummyStories, navigate]);

  const nextStory = () => {
    if (currentStory < dummyStories.length - 1) {
      setCurrentStory(currentStory + 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const prevStory = () => {
    if (currentStory > 0) {
      setCurrentStory(currentStory - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  return (
    <StoryDetailLayout backgroundImage={currentStoryData.imageSrc}>
      {/* 타임바 */}
      <div className="flex space-x-1 mt-4">
        {dummyStories.map((_, index) => (
          <div key={index} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width:
                  index < currentStory ? '100%' : index === currentStory ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="mt-10 text-white text-center text-lm font-bold">
        {currentStoryData.date.slice(0, 7)}
      </div>

      {/* 멘트 */}
      <div className="mt-2 text-white whitespace-pre-line text-center font-bold text-lg leading-relaxed">
        {currentStoryData.message}
      </div>

      {/* 네비게이션 영역 */}
      <div className="absolute inset-0 z-10 flex">
        <div className="w-1/2 h-full" onClick={prevStory} />
        <div className="w-1/2 h-full" onClick={nextStory} />
      </div>

      {/* 결제 내역 카드 */}
      <div className="mt-auto mb-4">
        <PaymentCard
          date={currentStoryData.date}
          title={currentStoryData.title}
          price={currentStoryData.price}
          imageSrc={currentStoryData.imageSrc}
        />
      </div>
    </StoryDetailLayout>
  );
}
