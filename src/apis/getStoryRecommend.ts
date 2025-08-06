import axiosInstance from '@/apis/axiosInstance';
import type { StoryDiagnosisParams } from './getStoryDiagnosis';

export interface RecommendPlace {
  placeId: number;
  placeName: string;
  latitude: number;
  longitude: number;
  distanceInMeters: number;
  score?: number;
}

interface RecommendPlaceRequest {
  latitude: number;
  longitude: number;
  user: StoryDiagnosisParams;
}

interface ApiResponse<T> {
  resultCode: number;
  codeName: string;
  message: string;
  data: T;
}

export const getRecommendedPlaces = async (
  request: RecommendPlaceRequest
): Promise<RecommendPlace[]> => {
  const response = await axiosInstance.post<ApiResponse<RecommendPlace[]>>(
    '/recommend/places',
    request
  );
  return response.data.data;
};
