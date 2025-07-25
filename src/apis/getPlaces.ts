import axiosInstance from './axiosInstance';
import type { Place } from '@/types/map';

interface GetPlacesParams {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
  isFavorite?: boolean;
  categoryCode?: string | null;
  benefitCategory?: string | null;
}

export const getPlaces = async ({
  swLat,
  swLng,
  neLat,
  neLng,
  isFavorite,
  categoryCode,
  benefitCategory,
}: GetPlacesParams): Promise<Place[]> => {
  try {
    const res = await axiosInstance.get('/places', {
      params: {
        southWestLatitude: swLat,
        southWestLongitude: swLng,
        northEastLatitude: neLat,
        northEastLongitude: neLng,
        isFavorite: isFavorite ? 'true' : undefined,
        categoryCode: categoryCode ?? undefined,
        benefitCategory: benefitCategory ?? undefined,
      },
    });

    return res.data?.data || [];
  } catch (error) {
    console.error('장소 가져오기 실패:', error);
    throw error;
  }
};
