import axiosInstance from './axiosInstance';
import type { UserCoupon } from '@/types/coupon';

interface UserCouponListResponse {
  count: number;
  coupons: UserCoupon[];
}

/**
 * 유저 쿠폰 리스트 API
 * @returns UserCouponListResponse
 */
export const getUserCoupons = async (): Promise<UserCouponListResponse> => {
  try {
    const response = await axiosInstance.get('/coupons/me');
    console.log('🎯 coupons API 응답:', response.data);
    return response.data?.data;
  } catch (error) {
    console.error('❌ 유저 쿠폰 리스트 불러오기 실패:', error);
    return { count: 0, coupons: [] };
  }
};
