import axiosInstance from './axiosInstance';
import type { StoreData } from '@/types/storeDetail';

export interface PlaceDetailResponse {
  placeId: number;
  name: string;
  address: string;
  categoryCode: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  startTime: number;
  endTime: number;
  favorite: boolean;
  markerCode: string;
  eventTypeCode: 'NONE' | 'GENERAL' | 'REQUIRE';
  tel: string;
  discountPolicyDetailId: number | null;
  franchiseId: number;
  benefitDesc: string;
  coupons: {
    couponTemplateId: number;
    couponName: string;
    discountCode: 'COUPON_PERCENT' | 'COUPON_FIXED';
    membershipCode: string;
    discountInfo: string | null;
    couponStart: string;
    couponEnd: string;
    userCouponId: number | null;
    downloaded: boolean;
  }[];
}

const convertToStoreData = (data: PlaceDetailResponse): StoreData => {
  return {
    placeId: data.placeId,
    name: data.name,
    address: data.address,
    category: data.categoryCode,
    distance: `${data.distanceKm.toFixed(1)}km`,
    latitude: data.latitude,
    longitude: data.longitude,
    hours: `${data.startTime}:00 ~ ${data.endTime}:00`,
    tel: data.tel,
    isBookmarked: data.favorite,
    status: data.endTime < new Date().getHours() ? '영업종료' : '영업중',
    benefitDesc: data.benefitDesc,
    eventTypeCode: data.eventTypeCode,
    coupons: data.coupons.map((c) => ({
      couponTemplateId: c.couponTemplateId,
      couponName: c.couponName,
      discountCode: c.discountCode,
      membershipCode: c.membershipCode,
      discountInfo: c.discountInfo,
      couponStart: c.couponStart,
      couponEnd: c.couponEnd,
      userCouponId: c.userCouponId,
      downloaded: c.downloaded,
    })),
  };
};

//  장소 상세 조회 API
export const getPlaceDetail = async (
  placeId: number,
  latitude: string,
  longitude: string
): Promise<StoreData> => {
  const response = await axiosInstance.get(`/places/${placeId}`, {
    params: { latitude, longitude },
  });

  const data: PlaceDetailResponse | undefined = response.data?.data;

  if (!data) {
    throw new Error('❌ 상세 정보 데이터가 없습니다 (data is null)');
  }

  return convertToStoreData(data);
};
