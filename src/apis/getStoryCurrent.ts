import axiosInstance from '@/apis/axiosInstance';

export interface RepresentativeLog {
  date: string;
  storeName: string;
  amount: number;
  logoUrl: string;
}

export interface StoryCurrentResponse {
  month: string;
  comment: string;
  imageUrl: string;
  representativeLog: RepresentativeLog;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getStoryCurrent = async (): Promise<StoryCurrentResponse> => {
  const response = await axiosInstance.get<ApiResponse<StoryCurrentResponse>>('/story/current');
  return response.data.data;
};
