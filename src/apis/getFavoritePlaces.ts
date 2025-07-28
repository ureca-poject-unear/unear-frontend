import axiosInstance from './axiosInstance';
import type { FavoritePlace } from '@/types/bookmark';

/**
 * 사용자 즐겨찾기 리스트 조회 API
 * @returns FavoritePlace[]
 */
export const getFavoritePlaces = async (): Promise<FavoritePlace[]> => {
  try {
    const response = await axiosInstance.get('/places/favorite');
    return response.data?.data || [];
  } catch (error) {
    console.error('즐겨찾기 목록 불러오기 실패:', error);
    return [];
  }
};
