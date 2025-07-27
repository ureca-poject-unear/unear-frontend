import axiosInstance from './axiosInstance';
import type { Place } from '@/types/map';

interface GetPlacesParams {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
  isFavorite?: boolean;
  categoryCodes?: string[];
  benefitCategories?: string[];
}

export const getPlaces = async ({
  swLat,
  swLng,
  neLat,
  neLng,
  isFavorite,
  categoryCodes,
  benefitCategories,
}: GetPlacesParams): Promise<Place[]> => {
  try {
    const res = await axiosInstance.get('/places', {
      params: {
        southWestLatitude: swLat,
        southWestLongitude: swLng,
        northEastLatitude: neLat,
        northEastLongitude: neLng,
        isFavorite: isFavorite ? 'true' : undefined,
        categoryCode: categoryCodes,
        benefitCategory: benefitCategories,
      },
    });

    return res.data?.data || [];
  } catch (error) {
    console.error('장소 가져오기 실패:', error);
    console.log('[getPlaces] categoryCodes:', categoryCodes);
    console.log('[getPlaces] benefitCategories:', benefitCategories);
    throw error;
  }
};
