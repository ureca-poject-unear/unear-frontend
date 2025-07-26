import axiosInstance from './axiosInstance';

export const getNearbyStores = async (latitude: number, longitude: number) => {
  const res = await axiosInstance.get('/places/nearby-with-coupons', {
    params: { latitude, longitude },
  });
  console.log('🎯 주변매장과 쿠폰 응답:', res.data);
  return res.data.data;
};
