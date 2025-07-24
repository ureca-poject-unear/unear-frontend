import { useState, useEffect } from 'react';
import type { BookmarkStore } from '@/types/bookmark';

// 더미 데이터
const dummyBookmarkData: BookmarkStore[] = [
  {
    id: '1',
    name: '스타벅스 강남점',
    address: '서울 강남구 테헤란로 152',
    distance: '0.2km',
    hours: '06:00 - 22:00',
    category: 'CAFE',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    status: '영업중',
    isBookmarked: true,
  },
  {
    id: '2',
    name: '맥도날드 역삼점',
    address: '서울 강남구 강남대로 320',
    distance: '0.3km',
    hours: '24시간',
    category: 'FOOD',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    status: '영업종료',
    isBookmarked: true,
  },
  {
    id: '3',
    name: '올리브영 강남점',
    address: '서울 강남구 테헤란로 158',
    distance: '0.1km',
    hours: '10:00 - 22:00',
    category: 'BEAUTY',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    status: '영업중',
    isBookmarked: true,
  },
  {
    id: '4',
    name: 'GS25 테헤란점',
    address: '서울 강남구 테헤란로 160',
    distance: '0.1km',
    hours: '24시간',
    category: 'LIFE',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    status: '영업중',
    isBookmarked: true,
  },
  {
    id: '5',
    name: '투레쥬르 강남점',
    address: '서울 강남구 강남대로 322',
    distance: '0.4km',
    hours: '07:00 - 23:00',
    category: 'BAKERY',
    storeClass: 'LOCAL',
    event: 'GENERAL',
    status: '이벤트 매장',
    isBookmarked: true,
  },
  {
    id: '6',
    name: 'CGV 강남점',
    address: '서울 강남구 강남대로 438',
    distance: '0.5km',
    hours: '10:00 - 24:00',
    category: 'CULTURE',
    storeClass: 'FRANCHISE',
    event: 'REQUIRE',
    status: '필수 매장',
    isBookmarked: true,
  },
  {
    id: '7',
    name: '이디야커피 역삼점',
    address: '서울 강남구 테헤란로 164',
    distance: '0.2km',
    hours: '07:00 - 22:00',
    category: 'CAFE',
    storeClass: 'LOCAL',
    event: 'NONE',
    status: '영업중',
    isBookmarked: true,
  },
  {
    id: '8',
    name: '롯데리아 강남점',
    address: '서울 강남구 강남대로 324',
    distance: '0.3km',
    hours: '24시간',
    category: 'FOOD',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    status: '영업종료',
    isBookmarked: true,
  },
  {
    id: '9',
    name: '아트박스 강남점',
    address: '서울 강남구 테헤란로 166',
    distance: '0.2km',
    hours: '10:00 - 22:00',
    category: 'SHOPPING',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    status: '영업중',
    isBookmarked: true,
  },
  {
    id: '10',
    name: '스포츠몬스터 강남점',
    address: '서울 강남구 강남대로 326',
    distance: '0.6km',
    hours: '10:00 - 22:00',
    category: 'ACTIVITY',
    storeClass: 'BASIC',
    event: 'GENERAL',
    status: '이벤트 매장',
    isBookmarked: true,
  },
  {
    id: '11',
    name: '컴포즈커피 역삼점',
    address: '서울 강남구 테헤란로 168',
    distance: '0.2km',
    hours: '06:30 - 22:30',
    category: 'CAFE',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    status: '영업중',
    isBookmarked: true,
  },
  {
    id: '12',
    name: '버거킹 강남점',
    address: '서울 강남구 강남대로 328',
    distance: '0.4km',
    hours: '09:00 - 24:00',
    category: 'FOOD',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    status: '영업중',
    isBookmarked: true,
  },
  {
    id: '13',
    name: '네일샵 강남점',
    address: '서울 강남구 테헤란로 170',
    distance: '0.3km',
    hours: '10:00 - 21:00',
    category: 'BEAUTY',
    storeClass: 'LOCAL',
    event: 'REQUIRE',
    status: '필수 매장',
    isBookmarked: true,
  },
  {
    id: '14',
    name: 'CU 역삼점',
    address: '서울 강남구 테헤란로 172',
    distance: '0.1km',
    hours: '24시간',
    category: 'LIFE',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    status: '영업중',
    isBookmarked: true,
  },
  {
    id: '15',
    name: '파리바게뜨 강남점',
    address: '서울 강남구 강남대로 330',
    distance: '0.5km',
    hours: '07:00 - 22:00',
    category: 'BAKERY',
    storeClass: 'FRANCHISE',
    event: 'NONE',
    status: '영업중',
    isBookmarked: true,
  },
];

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
      // 실제로는 API에서 데이터를 가져옴
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBookmarks(dummyBookmarkData);
      setDisplayedBookmarks(dummyBookmarkData.slice(0, itemsPerPage));
      setIsLoading(false);
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
