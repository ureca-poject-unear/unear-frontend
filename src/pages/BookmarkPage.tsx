import Header from '@/components/common/Header';
import LoadingScreen from '@/components/common/LoadingScreen';
import EmptyState from '@/components/common/EmptyState';
import { BookmarkHeader, BookmarkList } from '@/components/bookmark';
import { useBookmarkData, useBookmarkHandlers, useInfiniteScroll } from '@/hooks/bookmark';

const BookmarkPage = () => {
  // 데이터 관리
  const {
    bookmarks,
    displayedBookmarks,
    isLoading,
    isLoadingMore,
    currentPage,
    setBookmarks,
    setDisplayedBookmarks,
    setIsLoadingMore,
    setCurrentPage,
  } = useBookmarkData();

  // 액션 핸들러
  const { handleBack, handleBookmarkToggle, loadMoreData } = useBookmarkHandlers({
    bookmarks,
    displayedBookmarks,
    currentPage,
    isLoadingMore,
    setBookmarks,
    setDisplayedBookmarks,
    setIsLoadingMore,
    setCurrentPage,
  });

  // 무한 스크롤
  const hasMoreItems = displayedBookmarks.length < bookmarks.length;
  useInfiniteScroll({ loadMoreData, hasMoreItems });

  if (isLoading) {
    return (
      <>
        <Header title="즐겨찾기" onBack={handleBack} />
        <LoadingScreen message="즐겨찾기 목록을 불러오는 중..." />
      </>
    );
  }

  return (
    <>
      <Header title="즐겨찾기" onBack={handleBack} />

      <div className="bg-background min-h-screen">
        {displayedBookmarks.length === 0 ? (
          <div className="pt-20">
            <EmptyState />
          </div>
        ) : (
          <div className="px-5 pt-5 pb-20">
            {/* 헤더 - 즐겨찾기 개수 */}
            <BookmarkHeader totalCount={bookmarks.length} />

            {/* 북마크 리스트 */}
            <BookmarkList
              bookmarks={displayedBookmarks}
              onBookmarkToggle={handleBookmarkToggle}
              isLoadingMore={isLoadingMore}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default BookmarkPage;
