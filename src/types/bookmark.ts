import type { CategoryType, StoreClassType } from './myPage';

export interface BookmarkStore {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  category: CategoryType;
  storeClass: StoreClassType;
  status: '영업중' | '영업종료';
  isBookmarked: boolean;
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
