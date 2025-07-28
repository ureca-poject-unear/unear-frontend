import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleFavorite } from '@/apis/postFavorite';
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
  handleBookmarkToggle: (storeId: string, _isBookmarked: boolean) => void;
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
  const handleBookmarkToggle = async (storeId: string, _isBookmarked: boolean) => {
    try {
      // 실제 API 호출
      const placeId = parseInt(storeId, 10);
      const actualState = await toggleFavorite(placeId);

      // API 응답에 따라 UI 업데이트 (목록에서 제거하지 않고 상태만 변경)
      const updateBookmarkState = (prev: BookmarkStore[]) =>
        prev.map((store) =>
          store.id === storeId ? { ...store, isBookmarked: actualState } : store
        );

      setBookmarks(updateBookmarkState);
      setDisplayedBookmarks(updateBookmarkState);

      console.log(`즐겨찾기 ${actualState ? '추가' : '제거'} 성공:`, storeId);
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
      // 에러 발생 시 상태 유지
    }
  };

  // 더 많은 데이터 로드
  const loadMoreData = useCallback(async () => {
    if (isLoadingMore || displayedBookmarks.length >= bookmarks.length) return;

    setIsLoadingMore(true);

    // 시뮬레이션 딜레이 (실제로는 이미 모든 데이터를 가지고 있음)
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
