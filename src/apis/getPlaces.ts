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
    const places = res.data?.data || [];

    // 데이터 콘솔 출력
    console.log('[getPlaces] 가져온 장소 데이터:', places);

    return res.data?.data || [];
  } catch (error) {
    console.error('장소 가져오기 실패:', error);
    console.log('[getPlaces] categoryCodes:', categoryCodes);
    console.log('[getPlaces] benefitCategories:', benefitCategories);
    throw error;
  }
};

//검색
interface GetPlacesForSearchParams {
  keyword: string;
  southWestLatitude: number;
  southWestLongitude: number;
  northEastLatitude: number;
  northEastLongitude: number;
  categoryCodes?: string[];
  benefitCategories?: string[];
  isFavorite?: boolean;
}

export const getPlacesForSearch = async ({
  keyword,
  southWestLatitude,
  southWestLongitude,
  northEastLatitude,
  northEastLongitude,
  categoryCodes,
  benefitCategories,
  isFavorite,
}: GetPlacesForSearchParams): Promise<Place[]> => {
  try {
    const res = await axiosInstance.get('/places', {
      params: {
        keyword,
        southWestLatitude,
        southWestLongitude,
        northEastLatitude,
        northEastLongitude,
        categoryCode: categoryCodes,
        benefitCategory: benefitCategories,
        isFavorite: isFavorite ? 'true' : undefined,
      },
    });

    return res.data?.data || [];
  } catch (error) {
    console.error('🔍 검색 API 실패:', error);
    console.log('[getPlacesForSearch] keyword:', keyword);
    throw error;
  }
};
