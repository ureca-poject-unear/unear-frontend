import type { CategoryType, StoreClassType } from './myPage';

export interface UsageHistoryItem {
  id: string;
  storeName: string;
  usedDate: string;
  originalPrice: number;
  discountPrice: number;
  category: CategoryType;
  storeClass: StoreClassType;
}

export interface UsageHistoryStatsData {
  totalSavings: number;
  totalTransactions: number;
}

export interface UsageHistoryFilter {
  category: string;
  period: string;
}

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export type { CategoryType, StoreClassType };
