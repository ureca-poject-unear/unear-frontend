import axiosInstance from './axiosInstance';

// 백엔드 API 응답 타입
export interface FavoritePlace {
  placeId: number;
  placeName: string;
  placeDesc: string;
  address: string;
  latitude: number;
  longitude: number;
  benefitCategory: string;
  startTime: number;
  endTime: number;
  categoryCode: string;
  markerCode: string;
  eventCode: string;
  franchiseName: string | null;
  favorite: boolean;
  distanceKm: number | null;
}

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
