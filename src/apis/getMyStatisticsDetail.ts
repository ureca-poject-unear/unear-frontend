import axiosInstance from './axiosInstance';
import { showErrorToast } from '@/utils/toast';

// API 응답 구조에 맞춘 인터페이스
export interface MyStatisticsDetailResponse {
  totalSpent: number;
  totalDiscount: number;
  discountByCategory: Record<string, number>;
  discountCategoryRatio: Record<string, number>;
  spentChangeRatio: number;
  discountChangeRatio: number;
}

interface ApiResponse {
  resultCode: number;
  codeName: string;
  message: string;
  data: MyStatisticsDetailResponse;
}

// Axios 에러 타입 정의
interface AxiosError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  code?: string;
  message?: string;
}

/**
 * 개인별 통계 상세 정보를 조회합니다
 * @param year 년도
 * @param month 월 (1-12)
 * @returns 통계 상세 데이터 또는 null
 */
export const getMyStatisticsDetail = async (
  year: number,
  month: number
): Promise<MyStatisticsDetailResponse | null> => {
  try {
    console.log('📊 개인별 통계 상세 조회 요청...', { year, month });

    const response = await axiosInstance.get<ApiResponse>('/users/me/statistics/detail', {
      params: { year, month },
      timeout: 10000, // 10초 타임아웃
    });

    console.log('✅ 개인별 통계 상세 API 응답:', response.data);

    if (response.data.resultCode === 200 && response.data.data) {
      const detailData = response.data.data;

      console.log('✅ 개인별 통계 상세 조회 성공:', detailData);
      return detailData;
    } else {
      throw new Error('통계 상세 정보를 가져올 수 없습니다.');
    }
  } catch (error: unknown) {
    console.error('❌ 개인별 통계 상세 조회 실패:', error);

    const axiosError = error as AxiosError;

    // 세분화된 에러 처리
    if (axiosError.response) {
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message;

      switch (status) {
        case 401:
          // 인증 오류는 AuthProvider에서 처리됨
          console.warn('⚠️ 인증 오류 - 토큰 갱신 시도');
          break;
        case 404:
          showErrorToast('통계 상세 정보를 찾을 수 없습니다.');
          break;
        case 500:
          showErrorToast('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
            showErrorToast('네트워크 연결을 확인해주세요.');
          } else {
            showErrorToast(message || '통계 상세 정보 조회에 실패했습니다.');
          }
      }
    }

    return null;
  }
};
