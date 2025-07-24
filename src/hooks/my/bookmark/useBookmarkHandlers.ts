import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BookmarkStore } from '@/types/bookmark';

interface UseBookmarkHandlersProps {
  bookmarks: BookmarkStore[];
  displayedBookmarks: BookmarkStore[];
  currentPage: number;
  isLoadingMore: boolean;
  setBookmarks: React.Dispatch<React.SetStateAction<BookmarkStore[]>>;
  setDisplayedBookmarks: React.Dispatch<React.SetStateAction<BookmarkStore[]>>;
  setIsLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

interface UseBookmarkHandlersReturn {
  handleBack: () => void;
  handleBookmarkToggle: (storeId: string, isBookmarked: boolean) => void;
  loadMoreData: () => void;
}

const useBookmarkHandlers = ({
  bookmarks,
  displayedBookmarks,
  currentPage,
  isLoadingMore,
  setBookmarks,
  setDisplayedBookmarks,
  setIsLoadingMore,
  setCurrentPage,
}: UseBookmarkHandlersProps): UseBookmarkHandlersReturn => {
  const navigate = useNavigate();
  const itemsPerPage = 8;

  const handleBack = () => navigate(-1);

  // 즐겨찾기 토글
  const handleBookmarkToggle = (storeId: string, isBookmarked: boolean) => {
    setBookmarks((prev) =>
      prev.map((store) => (store.id === storeId ? { ...store, isBookmarked } : store))
    );
    setDisplayedBookmarks((prev) =>
      prev.map((store) => (store.id === storeId ? { ...store, isBookmarked } : store))
    );

    console.log(`즐겨찾기 ${isBookmarked ? '추가' : '제거'}:`, storeId);
  };

  // 더 많은 데이터 로드
  const loadMoreData = useCallback(async () => {
    if (isLoadingMore || displayedBookmarks.length >= bookmarks.length) return;

    setIsLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newItems = bookmarks.slice(startIndex, endIndex);

    setDisplayedBookmarks((prev) => [...prev, ...newItems]);
    setCurrentPage(nextPage);
    setIsLoadingMore(false);
  }, [
    bookmarks,
    currentPage,
    displayedBookmarks.length,
    isLoadingMore,
    setDisplayedBookmarks,
    setCurrentPage,
    setIsLoadingMore,
  ]);

  return {
    handleBack,
    handleBookmarkToggle,
    loadMoreData,
  };
};

export default useBookmarkHandlers;
