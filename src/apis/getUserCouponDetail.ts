import axiosInstance from './axiosInstance';
import type { UserCouponDetail } from '@/types/coupon';

/**
 * 특정 유저 쿠폰 상세 정보 조회 API
 * @param userCouponId - 쿠폰 ID
 * @returns UserCouponDetail 상세 정보
 */
export const getUserCouponDetail = async (
  userCouponId: number
): Promise<UserCouponDetail | null> => {
  try {
    const response = await axiosInstance.get(`/coupons/me/${userCouponId}`);
    return response.data?.data || null;
  } catch (error) {
    console.error(`❌ 쿠폰 상세 정보(${userCouponId}) 불러오기 실패:`, error);
    return null;
  }
};
