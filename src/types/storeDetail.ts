// 매장 운영 상태
export type StoreStatusType = '영업중' | '영업종료' | '필수 매장' | '이벤트 매장';

// 이벤트 타입 코드
export type EventTypeCode = 'NONE' | 'GENERAL' | 'REQUIRE';

// 혜택 쿠폰 정보
export interface Coupon {
  id: string;
  title: string;
  expiryDate: string;
}

// 장소 상세 정보
export interface StoreData {
  id: string; // placeId
  name: string; // 매장명
  address: string; // 주소
  distance: string; // 거리 (ex: '1.2km')
  hours: string; // 운영 시간 (ex: '09:00 - 20:00')
  category: string; // 카테고리 코드 (ex: 'CAFE', 'FOOD')
  status: StoreStatusType; // 매장 상태
  isBookmarked: boolean; // 즐겨찾기 여부
  latitude: number; // 위도
  longitude: number; // 경도
  tel?: string; // 전화번호 (옵션)
  benefitDesc?: string | null; // 혜택 설명
  eventTypeCode?: EventTypeCode; // 이벤트 타입
  coupons: Coupon[]; // 사용 가능한 쿠폰 리스트
}
