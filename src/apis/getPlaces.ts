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

// ✅ 중복 제거 유틸 함수: 동일한 placeName 하나만 유지
const removeDuplicatePlacesByName = (places: Place[]): Place[] => {
  const seen = new Set<string>();
  return places.filter((place) => {
    if (seen.has(place.placeName)) return false;
    seen.add(place.placeName);
    return true;
  });
};

// ✅ 장소 가져오기 API
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

    const rawPlaces: Place[] = res.data?.data || [];
    const uniquePlaces = removeDuplicatePlacesByName(rawPlaces);

    console.log('[getPlaces] 중복 제거된 장소 데이터:', uniquePlaces);
    return uniquePlaces;
  } catch (error) {
    console.error('장소 가져오기 실패:', error);
    console.log('[getPlaces] categoryCodes:', categoryCodes);
    console.log('[getPlaces] benefitCategories:', benefitCategories);
    throw error;
  }
};

// ✅ 검색용 장소 가져오기 API
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

    const rawPlaces: Place[] = res.data?.data || [];
    const uniquePlaces = removeDuplicatePlacesByName(rawPlaces);

    console.log('[getPlacesForSearch] 중복 제거된 검색 결과:', uniquePlaces);
    return uniquePlaces;
  } catch (error) {
    console.error('🔍 검색 API 실패:', error);
    console.log('[getPlacesForSearch] keyword:', keyword);
    throw error;
  }
};
