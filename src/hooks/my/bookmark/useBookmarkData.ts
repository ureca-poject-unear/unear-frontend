import { useState, useEffect } from 'react';
import { getFavoritePlaces } from '@/apis/getFavoritePlaces';
import { convertFavoritePlacesToBookmarkStores } from '@/utils/bookmarkUtils';
import type { BookmarkStore } from '@/types/bookmark';

interface UseBookmarkDataReturn {
  bookmarks: BookmarkStore[];
  displayedBookmarks: BookmarkStore[];
  isLoading: boolean;
  isLoadingMore: boolean;
  currentPage: number;
  setBookmarks: React.Dispatch<React.SetStateAction<BookmarkStore[]>>;
  setDisplayedBookmarks: React.Dispatch<React.SetStateAction<BookmarkStore[]>>;
  setIsLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const useBookmarkData = (): UseBookmarkDataReturn => {
  const [bookmarks, setBookmarks] = useState<BookmarkStore[]>([]);
  const [displayedBookmarks, setDisplayedBookmarks] = useState<BookmarkStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);

      try {
        // 실제 API에서 즐겨찾기 데이터 가져오기
        const favoritePlaces = await getFavoritePlaces();

        // 백엔드 데이터를 프론트엔드 형식으로 변환
        const convertedBookmarks = convertFavoritePlacesToBookmarkStores(favoritePlaces);

        setBookmarks(convertedBookmarks);
        setDisplayedBookmarks(convertedBookmarks.slice(0, itemsPerPage));
      } catch (error) {
        console.error('즐겨찾기 데이터 로드 실패:', error);
        // 에러 발생 시 빈 배열로 설정
        setBookmarks([]);
        setDisplayedBookmarks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return {
    bookmarks,
    displayedBookmarks,
    isLoading,
    isLoadingMore,
    currentPage,
    setBookmarks,
    setDisplayedBookmarks,
    setIsLoadingMore,
    setCurrentPage,
  };
};

export default useBookmarkData;
