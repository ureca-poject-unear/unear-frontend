import type { FavoritePlace, BookmarkStore } from '@/types/bookmark';
import type { CategoryType, StoreClassType } from '@/types/myPage';
import type { EventType } from '@/components/common/StoreTypeIcon';
import { formatDistance } from '@/utils/distanceUtils';

/**
 * 시간을 24시간 형식에서 12시간 형식 문자열로 변환
 * @param startTime - 시작 시간 (0-23)
 * @param endTime - 종료 시간 (0-23)
 * @returns 운영시간 문자열
 */
const formatOperatingHours = (startTime: number, endTime: number): string => {
  // 24시간 운영인 경우
  if (startTime === 0 && endTime === 0) {
    return '24시간';
  }

  // 정상적인 운영시간인 경우
  const formatTime = (time: number): string => {
    if (time === 0) return '00:00';
    return `${time.toString().padStart(2, '0')}:00`;
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

/**
 * 백엔드 eventCode를 프론트엔드 EventType으로 변환
 * @param eventCode - 백엔드 이벤트 코드
 * @returns EventType
 */
const mapEventCode = (eventCode: string): EventType => {
  switch (eventCode) {
    case 'GENERAL':
      return 'GENERAL';
    case 'REQUIRE':
      return 'REQUIRE';
    case 'NONE':
    default:
      return 'NONE';
  }
};

/**
 * 백엔드 FavoritePlace를 프론트엔드 BookmarkStore로 변환
 * @param favoritePlace - 백엔드 즐겨찾기 데이터
 * @returns BookmarkStore
 */
export const convertFavoritePlaceToBookmarkStore = (
  favoritePlace: FavoritePlace
): BookmarkStore => {
  return {
    id: favoritePlace.placeId.toString(),
    name: favoritePlace.placeName,
    address: favoritePlace.address,
    distance: formatDistance(favoritePlace.distanceKm),
    hours: formatOperatingHours(favoritePlace.startTime, favoritePlace.endTime),
    category: favoritePlace.categoryCode as CategoryType,
    storeClass: favoritePlace.markerCode as StoreClassType,
    event: mapEventCode(favoritePlace.eventCode),
    isBookmarked: favoritePlace.favorite, // API에서 favorite 속성 사용
    // phoneNumber는 API 응답에 없으므로 undefined
  };
};

/**
 * 백엔드 FavoritePlace 배열을 BookmarkStore 배열로 변환
 * @param favoritePlaces - 백엔드 즐겨찾기 데이터 배열
 * @returns BookmarkStore 배열
 */
export const convertFavoritePlacesToBookmarkStores = (
  favoritePlaces: FavoritePlace[]
): BookmarkStore[] => {
  return favoritePlaces.map(convertFavoritePlaceToBookmarkStore);
};
