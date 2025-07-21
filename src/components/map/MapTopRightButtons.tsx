import FilterIcon from '@/assets/map/mapFiliterIcon.svg?react';
import StarIcon from '@/assets/map/mapBookmarkIcon.svg?react';
import StarMarkedIcon from '@/assets/map/mapBookmarkIconMarked.svg?react';

interface Props {
  onToggleFilter: () => void;
  onToggleBookmark: () => void;
  isBookmarkOnly: boolean;
}

const MapTopRightButtons = ({ onToggleFilter, onToggleBookmark, isBookmarkOnly }: Props) => {
  return (
    <div className="absolute top-[84px] right-[10px] z-10 flex flex-col gap-[10px] items-end">
      {/* 필터 버튼 */}
      <button
        onClick={onToggleFilter}
        className="w-[45px] h-[45px] rounded-full bg-white flex items-center justify-center shadow-md"
      >
        <FilterIcon className="w-[20px] h-[20px]" />
      </button>

      {/* 즐겨찾기 버튼 */}
      <button
        onClick={onToggleBookmark}
        className="w-[45px] h-[45px] rounded-full bg-white flex items-center justify-center shadow-md"
      >
        {isBookmarkOnly ? (
          <StarMarkedIcon className="w-[20px] h-[20px]" />
        ) : (
          <StarIcon className="w-[20px] h-[20px]" />
        )}
      </button>
    </div>
  );
};

export default MapTopRightButtons;
