import type { CategoryType, StoreClassType } from './myPage';
import type { EventType } from '../components/common/StoreTypeIcon';
import type { StoreStatusType } from '../components/common/StoreStatus';

export interface BookmarkStore {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  category: CategoryType;
  storeClass: StoreClassType;
  event: EventType;
  status: StoreStatusType;
  isBookmarked: boolean;
  phoneNumber?: string;
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
