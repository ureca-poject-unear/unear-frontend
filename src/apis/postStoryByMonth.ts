import axiosInstance from '@/apis/axiosInstance';
import type { StoryItem } from './getStoryByMonth';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const postStoryByMonth = async (targetMonth: string): Promise<StoryItem | null> => {
  const response = await axiosInstance.post<ApiResponse<StoryItem[]>>('/story', { targetMonth });

  console.log('[POST 스토리 응답]', response.data);

  const list = response.data.data;
  if (!list || list.length === 0) return null;

  return list[0]; // 첫 번째 스토리만 반환
};
