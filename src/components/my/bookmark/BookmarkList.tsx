import BookmarkCard from '@/components/common/BookmarkCard';
import type { BookmarkStore } from '@/types/bookmark';

interface BookmarkListProps {
  bookmarks: BookmarkStore[];
  onBookmarkToggle: (storeId: string, isBookmarked: boolean) => void;
  isLoadingMore: boolean;
}

const BookmarkList = ({ bookmarks, onBookmarkToggle, isLoadingMore }: BookmarkListProps) => {
  return (
    <>
      <div className="space-y-[12px]">
        {bookmarks.map((store) => (
          <BookmarkCard key={store.id} store={store} onBookmarkToggle={onBookmarkToggle} />
        ))}
      </div>

      {isLoadingMore && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </>
  );
};

export default BookmarkList;
