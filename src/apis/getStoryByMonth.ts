import axiosInstance from '@/apis/axiosInstance';

export interface StoryItem {
  imageUrl: string;
  comment: string;
  date: string;
  storeName: string;
  amount: number;
  logoUrl: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getStoryByMonth = async (targetMonth: string): Promise<StoryItem | null> => {
  const response = await axiosInstance.get<ApiResponse<StoryItem[]>>(
    `/story?targetMonth=${targetMonth}`
  );

  console.log('[GET 스토리 응답]', response.data);

  const list = response.data.data;
  if (!list || list.length === 0) return null;

  return list[0]; // 첫 번째 스토리만 반환
};
