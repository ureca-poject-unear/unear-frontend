import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import StoryDetailLayout from '@/components/story/StoryDetailLayout';
import PaymentCard from '@/components/story/PaymentCard';
import Header from '@/components/common/Header';

import { postStoryByMonth } from '@/apis/postStoryByMonth';
import { getStoryByMonth } from '@/apis/getStoryByMonth';

import type { StoryItem } from '@/types/story';

export default function StoryDetailPage() {
  const navigate = useNavigate();
  const S3_BASE_URL = 'https://unear-uploads.s3.ap-southeast-2.amazonaws.com/';

  const [stories, setStories] = useState<StoryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const preloadImage = (url: string) => {
    const img = new Image();
    img.src = url;
  };

  const fetchData = async () => {
    const targetMonth = dayjs().subtract(1, 'month').format('YYYY-MM');

    try {
      await postStoryByMonth();
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error.message.includes('ALREADY_EXISTS_STORY') ||
          error.message.includes('이미 이번달에 생성된 스토리가 존재합니다'))
      ) {
        console.log('[INFO] 이번 달 스토리 이미 존재, 바로 GET 호출');
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
        return;
      } else {
        setErrorMessage('스토리 생성 중 알 수 없는 오류가 발생했습니다.');
        return;
      }
    }

    try {
      const storyData = await getStoryByMonth(targetMonth);
      if (Array.isArray(storyData)) {
        setStories(storyData);

        // 선로딩 처리 (스토리 이미지 + 로고 이미지)
        storyData.forEach((story) => {
          if (story.imageUrl) {
            preloadImage(S3_BASE_URL + story.imageUrl);
          }
          if (story.logoUrl) {
            preloadImage(S3_BASE_URL + story.logoUrl + '.png');
          }
        });
      } else {
        setErrorMessage('스토리 데이터를 불러오지 못했습니다.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('스토리 조회 중 알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isPlaying || stories.length === 0) return;
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, stories]);

  useEffect(() => {
    if (progress < 100 || stories.length === 0) return;

    if (currentStory < stories.length - 1) {
      setCurrentStory((prev) => prev + 1);
      setProgress(0);
      setIsPlaying(true);
    } else {
      // 모든 스토리 끝나면 StoryEndPage로 스토리 데이터 넘기기
      navigate('/story/end', { state: { stories } });
    }
  }, [progress, currentStory, stories, navigate]);

  const prevStory = () => {
    if (currentStory > 0) {
      setCurrentStory((prev) => prev - 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const nextStory = () => {
    if (currentStory < stories.length - 1) {
      setCurrentStory((prev) => prev + 1);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  if (errorMessage) {
    return <p className="text-center mt-10 text-m text-red-600">{errorMessage}</p>;
  }

  if (stories.length === 0) {
    return <p className="text-center mt-10 text-m text-black">스토리 데이터가 없습니다.</p>;
  }

  const currentStoryData = stories[currentStory];
  const imageFullUrl = S3_BASE_URL + currentStoryData.imageUrl;
  const franchiseImageUrl = currentStoryData.logoUrl
    ? S3_BASE_URL + currentStoryData.logoUrl + '.png'
    : imageFullUrl;

  return (
    <StoryDetailLayout backgroundImage={imageFullUrl}>
      <Header title="스토리 보기" />

      <div className="mt-4">
        <div className="flex space-x-1 w-full">
          {stories.map((_, index) => (
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
      </div>

      <div className="mt-10 text-white text-center text-lm font-bold">
        {currentStoryData.date.slice(0, 7).replace('-', '.')}
      </div>

      <div className="mt-2 text-white whitespace-pre-line text-center font-bold text-lg leading-relaxed px-5">
        {currentStoryData.comment}
      </div>

      <div className="absolute inset-0 z-10 flex">
        <div className="w-1/2 h-full cursor-pointer" onClick={prevStory} />
        <div className="w-1/2 h-full cursor-pointer" onClick={nextStory} />
      </div>

      <div className="mt-auto mb-4 w-full">
        <PaymentCard
          date={currentStoryData.date}
          title={currentStoryData.storeName}
          price={`${currentStoryData.amount.toLocaleString()}원`}
          imageSrc={franchiseImageUrl}
        />
      </div>
    </StoryDetailLayout>
  );
}
