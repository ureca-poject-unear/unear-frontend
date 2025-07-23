import { useNavigate } from 'react-router-dom';
import StoryLayout from '@/components/story/StoryLayout';
import StoryButton from '@/components/common/StoryButton';

interface DiagnosisData {
  category: string;
  emoji: string;
  label: string;
  description: string[];
}

const diagnosisMap: Record<string, DiagnosisData> = {
  카페: {
    category: '카페',
    emoji: '☕',
    label: '카페 출석왕',
    description: [
      '하루를 여는 건 커피 한 잔부터!',
      '익숙한 카페부터 새로운 분위기의 카페까지,',
      '당신은 감성과 향기를 동시에 즐기는',
      '진정한 카페 탐험가예요.',
    ],
  },
  푸드: {
    category: '푸드',
    emoji: '🍔',
    label: '쩝쩝박사',
    description: [
      '축제의 즐거움은 맛에 있다고 믿는 당신!',
      '다양한 먹거리를 탐험하고 맛으로 추억을 쌓는',
      '미식 탐험가 타입이에요.',
      '비가 와도 맛있는 음식이 있다면 즐겁죠.',
    ],
  },
  // 기타 카테고리 생략
};

const StoryDiagnosisPage = () => {
  const navigate = useNavigate();

  const diagnosis = diagnosisMap['푸드']; // 예시로 '푸드' 고정

  return (
    <StoryLayout headerTitle="진단" bgColorClass="bg-storybackground3">
      <div className="flex flex-col items-center justify-between w-full h-full px-5 py-10">
        <div className="flex flex-col items-center text-center">
          <p className="text-9xl mb-4">{diagnosis.emoji}</p>

          <p className="text-white text-lm font-semibold mb-1">나의 결제 타입은</p>

          <p className="text-white text-xl font-semibold mb-4">[{diagnosis.label}]</p>

          {diagnosis.description.map((line, index) => (
            <p key={index} className="text-white text-m font-regular mb-1">
              {line}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-3 mt-10">
          <StoryButton text="소비 스토리 보기" onClick={() => navigate('/story/2')} />
          <StoryButton
            text="추천 매장"
            onClick={() => navigate('/story/recommend', { state: { diagnosis } })}
          />
        </div>
      </div>
    </StoryLayout>
  );
};

export default StoryDiagnosisPage;
