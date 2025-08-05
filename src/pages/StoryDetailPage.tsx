import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StoryDetailLayout from '@/components/story/StoryDetailLayout';
import PaymentCard from '@/components/story/PaymentCard';
import type { StoryCurrentResponse } from '@/apis/getStoryCurrent';
import { getStoryCurrent } from '@/apis/getStoryCurrent';
import LoadingScreen from '@/components/common/LoadingScreen';

const S3_BASE_URL = 'https://unear-uploads.s3.ap-southeast-2.amazonaws.com/';

// 절대 경로인지 확인
const isAbsoluteUrl = (url: string) => /^https?:\/\//.test(url);

export default function StoryDetailPage() {
  const navigate = useNavigate();
  const [storyData, setStoryData] = useState<StoryCurrentResponse | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStoryCurrent();
        console.log('스토리 API 응답:', data);
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

  const { month, comment, imageUrl, representativeLog } = storyData;

  const fullBackgroundImageUrl = isAbsoluteUrl(imageUrl) ? imageUrl : `${S3_BASE_URL}${imageUrl}`;

  const fullLogoUrl = isAbsoluteUrl(representativeLog.logoUrl)
    ? representativeLog.logoUrl
    : `${S3_BASE_URL}${representativeLog.logoUrl}`;

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
      <div className="mt-10 text-white text-center text-lm font-bold">{month}</div>

      {/* 멘트 */}
      <div className="mt-2 text-white whitespace-pre-line text-center font-bold text-lg leading-relaxed">
        {comment}
      </div>

      {/* 네비게이션 터치 영역 */}
      <div className="absolute inset-0 z-10 flex">
        <div className="w-full h-full" onClick={() => setProgress(100)} />
      </div>

      {/* 결제 내역 카드 */}
      <div className="mt-auto mb-4">
        <PaymentCard
          date={representativeLog.date}
          title={representativeLog.storeName}
          price={`${representativeLog.amount.toLocaleString()}원`}
          imageSrc={fullLogoUrl}
        />
      </div>
    </StoryDetailLayout>
  );
}
