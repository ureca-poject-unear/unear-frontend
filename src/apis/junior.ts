import axiosInstance from './axiosInstance';
import type { StoreInfo } from '@/components/common/BookmarkCard';
import type {
  CategoryType,
  EventType,
  StoreClassType,
  StoreStatusType,
} from '@/components/common/StoreTypeIcon';

// 서버에서 내려주는 주니어 매장 데이터의 타입 (예시)
interface JuniorStoreResponse {
  storeId: string;
  storeName: string;
  fullAddress: string;
  operatingHours: string;
  categoryCode: CategoryType;
  storeType: StoreClassType;
  eventCode: EventType;
  status: StoreStatusType;
  isBookmarked: boolean;
}

// 주니어 매장 목록을 가져오는 전용 API
export const getJuniorStores = async (): Promise<StoreInfo[]> => {
  try {
    // 1. 전국 단위의 주니어 매장 목록을 반환하는 API를 호출합니다.
    const response = await axiosInstance.get('/stores/junior');
    const data: JuniorStoreResponse[] | undefined = response.data?.data;

    if (!data) {
      return [];
    }

    // 2. 서버 데이터를 프론트엔드 StoreInfo 타입으로 변환합니다.
    const transformedData = data.map(
      (store): StoreInfo => ({
        id: store.storeId,
        name: store.storeName,
        address: store.fullAddress,
        hours: store.operatingHours,
        category: store.categoryCode,
        storeClass: store.storeType,
        event: store.eventCode,
        status: store.status,
        isBookmarked: store.isBookmarked,
      })
    );

    return transformedData;
  } catch (error) {
    console.error('getJuniorStores API 호출 오류:', error);
    throw error;
  }
};
