import axiosInstance from './axiosInstance';

export interface RawCoupon {
  userCouponId: number;
  couponName: string;
  barcodeNumber: string;
  couponStatusCode: string;
  createdAt: string;
  couponEnd: string;
}

export const getUserCoupons = async (): Promise<RawCoupon[]> => {
  const response = await axiosInstance.get('/app/coupons/me');
  return response.data.data.coupons;
};
