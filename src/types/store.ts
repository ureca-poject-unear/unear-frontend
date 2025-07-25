export interface NearbyCoupon {
  couponTemplateId: number;
  couponName: string;
  couponEnd: string;
}

export interface NearbyStore {
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
  eventTypeCode: string;
  tel: string;
  benefitDesc: string;
  coupons: NearbyCoupon[];
}
