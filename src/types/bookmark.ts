import type { CategoryType, StoreClassType } from './myPage';
import type { EventType } from '../components/common/StoreTypeIcon';

// 기존 BookmarkStore 타입 (UI용)
export interface BookmarkStore {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  category: CategoryType;
  storeClass: StoreClassType;
  event: EventType;
  isBookmarked: boolean;
  phoneNumber?: string;
}

// 백엔드 API 응답용 타입
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
  favorite: boolean; // isFavorite → favorite로 수정
  distanceKm: number | null;
}

export interface BookmarkPageState {
  bookmarks: BookmarkStore[];
  displayedBookmarks: BookmarkStore[];
  isLoading: boolean;
  isLoadingMore: boolean;
  currentPage: number;
}

export interface BookmarkHandlers {
  onBookmarkToggle: (storeId: string, isBookmarked: boolean) => void;
  onLoadMore: () => void;
}

export type { CategoryType, StoreClassType };
