import { useState, useEffect } from 'react';
import { getFavoritePlaces } from '@/apis/getFavoritePlaces';

const useBookmarkCount = () => {
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    const fetchBookmarkCount = async () => {
      try {
        const favoritePlaces = await getFavoritePlaces();
        setBookmarkCount(favoritePlaces.length);
      } catch (error) {
        console.error('즐겨찾기 개수 불러오기 실패:', error);
        setBookmarkCount(0);
      }
    };

    fetchBookmarkCount();
  }, []);

  return bookmarkCount;
};

export default useBookmarkCount;
