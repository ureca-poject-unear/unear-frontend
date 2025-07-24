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
  쇼핑: {
    category: '쇼핑',
    emoji: '🛍️',
    label: '쇼핑 러버',
    description: [
      '최신 트렌드에 민감한 당신!',
      '쇼핑은 단순 소비가 아닌 자기표현이에요.',
      '온라인이든 오프라인이든',
      '오늘도 득템의 기쁨을 누리는 중이군요.',
    ],
  },
  교육: {
    category: '교육',
    emoji: '🎓',
    label: '공부 벌레',
    description: [
      '새로운 지식에 대한 갈증이 가득한 당신!',
      '배움에서 즐거움을 찾고',
      '스스로 성장하는 걸 사랑하네요.',
      '지식이 곧 자산이 되는 타입이에요.',
    ],
  },
  '문화/여가': {
    category: '문화/여가',
    emoji: '🎨',
    label: '문화 덕후',
    description: [
      '전시, 공연, 영화까지 섭렵하는 당신!',
      '문화 속에서 휴식과 영감을 찾고',
      '감성을 충전하며 삶을 풍부하게 만드는',
      '예술 감성 충만 소비러네요.',
    ],
  },
  베이커리: {
    category: '베이커리',
    emoji: '🥐',
    label: '빵순이',
    description: [
      '고소한 향에 이끌려 들어간 베이커리에서',
      '갓 구운 빵과 함께 소소한 행복을 느끼는 당신!',
      '빵 하나에도 감동하는 감성파예요.',
      '오늘은 어떤 빵으로 기분 전환하셨나요?',
    ],
  },
  '뷰티/건강': {
    category: '뷰티/건강',
    emoji: '💄',
    label: '자기관리 끝판왕',
    description: [
      '몸도 마음도 건강하게!',
      '자기 관리에 아낌없이 투자하는 당신은',
      '자신을 사랑하는 법을 아는 사람이에요.',
      '매일을 더 나은 나로 만들어가고 있군요.',
    ],
  },
  '생활/편의': {
    category: '생활/편의',
    emoji: '🏡',
    label: '일상 혁신가',
    description: [
      '소소한 일상 속에서 편리함을 추구하는 당신!',
      '생활용품 하나도 꼼꼼히 고르고',
      '똑똑한 소비로 삶의 질을 높이네요.',
      '일상의 혁신을 이끄는 소비자예요.',
    ],
  },
  액티비티: {
    category: '액티비티',
    emoji: '🚴',
    label: '만능 스포츠맨',
    description: [
      '움직일 때 가장 살아있음을 느끼는 당신!',
      '다양한 활동에 도전하며',
      '에너지 넘치는 일상을 살아가네요.',
      '몸과 마음이 모두 건강한 타입이에요.',
    ],
  },
  팝업스토어: {
    category: '팝업스토어',
    emoji: '🛒',
    label: '팝업 헌터',
    description: [
      '남들보다 빠르게 팝업스토어에 도착!',
      '한정판, 체험형 공간을 즐기며',
      '새로움에 열광하는 당신은',
      '트렌드에 민감한 소비러예요.',
    ],
  },
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
          <StoryButton text="소비 스토리 보기" onClick={() => navigate('/story/detail')} />
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
