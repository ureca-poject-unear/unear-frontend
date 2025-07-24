import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import LoadingScreen from '@/components/common/LoadingScreen';
import BookmarkCard from '@/components/common/BookmarkCard';
import EmptyState from '@/components/common/EmptyState';
import type { CategoryType } from '@/components/common/StoreTypeIcon';
import type { StoreStatusType } from '@/components/common/StoreStatus';

interface BookmarkStore {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  category: CategoryType;
  status: StoreStatusType;
  isBookmarked: boolean;
}

// 더미 데이터 (15개)
const dummyBookmarkData: BookmarkStore[] = [
  {
    id: '1',
    name: '스타벅스 강남점',
    address: '서울 강남구 테헤란로 152',
    distance: '0.2km',
    hours: '06:00 - 22:00',
    category: 'CAFE',
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
    status: '영업중',
    isBookmarked: true,
  },
  {
    id: '6',
    name: 'CGV 강남점',
    address: '서울 강남구 강남대로 438',
    distance: '0.5km',
    hours: '10:00 - 24:00',
    category: 'CULTURE',
    status: '영업중',
    isBookmarked: true,
  },
  {
    id: '7',
    name: '이디야커피 역삼점',
    address: '서울 강남구 테헤란로 164',
    distance: '0.2km',
    hours: '07:00 - 22:00',
    category: 'CAFE',
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
    status: '영업중',
    isBookmarked: true,
  },
  {
    id: '11',
    name: '컴포즈커피 역삼점',
    address: '서울 강남구 테헤란로 168',
    distance: '0.2km',
    hours: '06:30 - 22:30',
    category: 'CAFE',
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
    status: '영업종료',
    isBookmarked: true,
  },
  {
    id: '14',
    name: 'CU 역삼점',
    address: '서울 강남구 테헤란로 172',
    distance: '0.1km',
    hours: '24시간',
    category: 'LIFE',
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
    status: '영업중',
    isBookmarked: true,
  },
];

const BookmarkPage = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkStore[]>([]);
  const [displayedBookmarks, setDisplayedBookmarks] = useState<BookmarkStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleBack = () => navigate(-1);

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
  }, [bookmarks, currentPage, displayedBookmarks.length, isLoadingMore]);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMoreData();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreData]);

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
            <div className="space-y-[12px]">
              {displayedBookmarks.map((store) => (
                <BookmarkCard
                  key={store.id}
                  store={store}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))}
            </div>

            {isLoadingMore && (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BookmarkPage;
