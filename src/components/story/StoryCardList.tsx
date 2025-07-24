import StoryCard from '@/components/story/StoryCard';

interface StoryType {
  id: number;
  imageSrc: string;
  date?: string;
}

interface StoryCardListProps {
  stories: StoryType[];
  showDate?: boolean;
}

export default function StoryCardList({ stories, showDate = false }: StoryCardListProps) {
  // 카드들을 두 번 반복해 무한 슬라이드 효과를 줌
  const repeatedStories = [...stories, ...stories];

  return (
    <div className="relative overflow-hidden w-full h-[260px] mb-8">
      <div
        className="flex gap-3 absolute whitespace-nowrap animate-slideLeft"
        style={{ willChange: 'transform' }}
      >
        {repeatedStories.map((story, idx) => (
          <div key={idx} className="inline-block flex-shrink-0 w-[140px]">
            <StoryCard imageSrc={story.imageSrc} date={story.date} showDate={showDate} />
          </div>
        ))}
      </div>
    </div>
  );
}
