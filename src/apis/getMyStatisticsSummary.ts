import axiosInstance from './axiosInstance';
import { showErrorToast } from '@/utils/toast';

// API 응답 구조에 맞춘 인터페이스
export interface MonthlyDiscountData {
  month: string; // "2025-07" 형태
  discount: number;
}

export interface MyStatisticsSummaryResponse {
  thisMonthDiscount: number;
  recentMonthDiscounts: MonthlyDiscountData[];
}

interface ApiResponse {
  resultCode: number;
  codeName: string;
  message: string;
  data: MyStatisticsSummaryResponse;
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
 * 마이페이지 통계 요약 정보를 조회합니다
 * @returns 통계 요약 데이터 또는 null
 */
export const getMyStatisticsSummary = async (): Promise<MyStatisticsSummaryResponse | null> => {
  try {
    console.log('📊 마이페이지 통계 요약 조회 요청...');

    const response = await axiosInstance.get<ApiResponse>('/users/me/statistics/summary', {
      timeout: 10000, // 10초 타임아웃
    });

    console.log('✅ 마이페이지 통계 요약 API 응답:', response.data);

    if (response.data.resultCode === 200 && response.data.data) {
      const summaryData = response.data.data;

      console.log('✅ 마이페이지 통계 요약 조회 성공:', summaryData);
      return summaryData;
    } else {
      throw new Error('통계 요약 정보를 가져올 수 없습니다.');
    }
  } catch (error: unknown) {
    console.error('❌ 마이페이지 통계 요약 조회 실패:', error);

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
          showErrorToast('통계 정보를 찾을 수 없습니다.');
          break;
        case 500:
          showErrorToast('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
            showErrorToast('네트워크 연결을 확인해주세요.');
          } else {
            showErrorToast(message || '통계 정보 조회에 실패했습니다.');
          }
      }
    }

    return null;
  }
};
