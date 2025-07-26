import axiosInstance from './axiosInstance';
import { showErrorToast } from '@/utils/toast';
import type { UserCouponDetail } from '@/types/coupon';

// API 응답 타입
interface GetUserCouponDetailResponse {
  resultCode: number;
  message: string;
  data: UserCouponDetail;
}

// Axios 에러 타입
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
 * 특정 유저 쿠폰 상세 정보 조회 API
 * @param userCouponId - 쿠폰 ID
 * @returns UserCouponDetail 상세 정보 (CouponItem 기반)
 */
export const getUserCouponDetail = async (
  userCouponId: number
): Promise<UserCouponDetail | null> => {
  try {
    console.log(`📋 쿠폰 상세 정보 조회 요청: ${userCouponId}`);

    const response = await axiosInstance.get(`/coupons/me/${userCouponId}`, {
      timeout: 10000, // 10초 타임아웃
    });

    const responseData = response.data as GetUserCouponDetailResponse;

    if (responseData.resultCode === 200 && responseData.data) {
      console.log(`✅ 쿠폰 상세 정보 조회 성공:`, responseData.data);
      return responseData.data;
    } else {
      throw new Error('쿠폰 상세 정보를 가져올 수 없습니다.');
    }
  } catch (error: unknown) {
    console.error(`❌ 쿠폰 상세 정보(${userCouponId}) 불러오기 실패:`, error);

    const axiosError = error as AxiosError;

    // 세분화된 에러 처리
    if (axiosError.response) {
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message;

      switch (status) {
        case 400:
          showErrorToast('잘못된 쿠폰 ID입니다.');
          break;
        case 401:
          console.warn('⚠️ 인증 오류 - 토큰 갱신 시도');
          break;
        case 403:
          showErrorToast('이 쿠폰에 접근할 권한이 없습니다.');
          break;
        case 404:
          showErrorToast('쿠폰을 찾을 수 없습니다.');
          break;
        case 500:
          showErrorToast('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          if (axiosError.code === 'NETWORK_ERROR' || !axiosError.response) {
            showErrorToast('네트워크 연결을 확인해주세요.');
          } else {
            showErrorToast(message || '쿠폰 정보를 불러올 수 없습니다.');
          }
      }
    } else {
      showErrorToast('쿠폰 정보를 불러올 수 없습니다.');
    }

    return null;
  }
};

/**
 * 쿠폰 사용 가능 여부 확인
 * @param coupon - 쿠폰 상세 정보 (CouponItem 기반)
 * @returns 사용 가능 여부와 불가능한 이유
 */
export const checkCouponUsability = (
  coupon: UserCouponDetail
): {
  canUse: boolean;
  reason?: string;
} => {
  if (coupon.isUsed) {
    return { canUse: false, reason: '이미 사용된 쿠폰입니다.' };
  }

  if (coupon.isExpired) {
    return { canUse: false, reason: '만료된 쿠폰입니다.' };
  }

  const now = new Date();
  const validFrom = new Date(coupon.validFrom);
  const validUntil = new Date(coupon.validUntil);

  if (now < validFrom) {
    return { canUse: false, reason: '아직 사용할 수 없는 쿠폰입니다.' };
  }

  if (now > validUntil) {
    return { canUse: false, reason: '만료된 쿠폰입니다.' };
  }

  return { canUse: true };
};
