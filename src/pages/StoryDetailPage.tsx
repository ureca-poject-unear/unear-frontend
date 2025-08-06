import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StoryDetailLayout from '@/components/story/StoryDetailLayout';
import PaymentCard from '@/components/story/PaymentCard';
import type { StoryItem } from '@/apis/getStoryByMonth';
import { getStoryByMonth } from '@/apis/getStoryByMonth';
import { postStoryByMonth } from '@/apis/postStoryByMonth';
import LoadingScreen from '@/components/common/LoadingScreen';

const S3_BASE_URL = 'https://unear-uploads.s3.ap-southeast-2.amazonaws.com/';

// 절대 경로 확인
const isAbsoluteUrl = (url: string) => /^https?:\/\//.test(url);

// 현재 연월 계산 함수 (예: 2025-8)
const getCurrentMonthString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return `${year}-${month}`;
};

export default function StoryDetailPage() {
  const navigate = useNavigate();
  const [storyData, setStoryData] = useState<StoryItem | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const targetMonth = getCurrentMonthString();

        // 1. GET으로 조회
        let data = await getStoryByMonth(targetMonth);

        // 2. 없으면 POST로 생성 요청
        if (!data) {
          data = await postStoryByMonth(targetMonth);
        }

        if (!data) {
          console.warn('스토리 데이터가 없습니다.');
          return;
        }

        setStoryData(data);
      } catch (error) {
        console.error('스토리 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    navigate('/story/end', { state: { story: storyData } });
  }, [progress, storyData, navigate]);

  if (!storyData) return <LoadingScreen />;

  const { imageUrl, comment, date, storeName, amount, logoUrl } = storyData;

  const fullBackgroundImageUrl = isAbsoluteUrl(imageUrl) ? imageUrl : `${S3_BASE_URL}${imageUrl}`;

  const fullLogoUrl = isAbsoluteUrl(logoUrl) ? logoUrl : `${S3_BASE_URL}${logoUrl}`;

  return (
    <StoryDetailLayout backgroundImage={fullBackgroundImageUrl}>
      {/* 타임바 */}
      <div className="flex space-x-1 mt-4">
        <div className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 날짜 */}
      <div className="mt-10 text-white text-center text-lm font-bold">{date}</div>

      {/* 멘트 */}
      <div className="mt-2 text-white whitespace-pre-line text-center font-bold text-lg leading-relaxed">
        {comment}
      </div>

      {/* 터치로 넘어가기 */}
      <div className="absolute inset-0 z-10 flex">
        <div className="w-full h-full" onClick={() => setProgress(100)} />
      </div>

      {/* 결제 카드 */}
      <div className="mt-auto mb-4">
        <PaymentCard
          date={date}
          title={storeName}
          price={`${amount.toLocaleString()}원`}
          imageSrc={fullLogoUrl}
        />
      </div>
    </StoryDetailLayout>
  );
}
