import { useRef, useState, useEffect } from 'react';
import type { MapContainerRef } from '@/components/map/MapContainer';
import MapContainer from '@/components/map/MapContainer';
import SearchBar from '@/components/common/SearchBar';
import MapActionButtons from '@/components/map/MapActionButtons';
import MapTopRightButtons from '@/components/map/MapTopRightButtons';
import BottomSheetEvent from '@/components/map/BottomSheetEvent';
import BottomSheetBarcode from '@/components/common/BottomSheetBarcode';
import MapLocationButton from '@/components/map/MapLocationButton';
import BottomSheetFilter from '@/components/map/BottomSheetFilter';
import BottomSheetCoupon from '@/components/map/BottomSheetCoupon';
import { useAuthStore } from '@/store/auth';
import BottomSheetLocationDetail from '@/components/map/BottomSheetLocationDetail';
import { getPlaceDetail } from '@/apis/getPlaceDetail';
import type { StoreData } from '@/types/storeDetail';

const MapPage = () => {
  const [isBookmarkOnly, setIsBookmarkOnly] = useState<boolean>(() => {
    const stored = localStorage.getItem('isBookmarkOnly');
    return stored ? JSON.parse(stored) : false;
  });
  const [categoryCodes, setCategoryCodes] = useState<string[]>(() => {
    const stored = localStorage.getItem('categoryCodes');
    return stored ? JSON.parse(stored) : [];
  });

  const [benefitCategories, setBenefitCategories] = useState<string[]>(() => {
    const stored = localStorage.getItem('benefitCategories');
    return stored ? JSON.parse(stored) : [];
  });
  const mapRef = useRef<MapContainerRef | null>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const ALL_CATEGORY_CODES = [
    'FOOD',
    'CAFE',
    'BAKERY',
    'LIFE',
    'ACTIVITY',
    'EDUCATION',
    'CULTURE',
    'SHOPPING',
    'CAFE',
    'BEAUTY',
  ];
  const ALL_BENEFIT_CODES = ['할인', '적립', '무료서비스', '상품 증정'];
  const { getUserDisplayName, getUserGrade, getBarcodeNumber } = useAuthStore();
  const displayName = getUserDisplayName();
  const userGrade = getUserGrade();
  const barcodeValue = getBarcodeNumber();
  const gradeForComponent = userGrade === 'BASIC' ? 'VIP' : userGrade;

  useEffect(() => {
    localStorage.setItem('isBookmarkOnly', JSON.stringify(isBookmarkOnly));
  }, [isBookmarkOnly]);

  useEffect(() => {
    if (categoryCodes.length === 0 || categoryCodes.length === ALL_CATEGORY_CODES.length) {
      localStorage.removeItem('categoryCodes');
    } else {
      localStorage.setItem('categoryCodes', JSON.stringify(categoryCodes));
    }
  }, [categoryCodes]);

  useEffect(() => {
    if (benefitCategories.length === 0 || benefitCategories.length === ALL_BENEFIT_CODES.length) {
      localStorage.removeItem('benefitCategories');
    } else {
      localStorage.setItem('benefitCategories', JSON.stringify(benefitCategories));
    }
  }, [benefitCategories]);

  const handleCurrentLocation = () => {
    mapRef.current?.showCurrentLocation();
  };

  const handleMarkerClick = async (placeId: number, storeLat: string, storeLng: string) => {
    try {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const userLat = pos.coords.latitude.toString();
          const userLng = pos.coords.longitude.toString();

          console.log('🧍 사용자 위치:', userLat, userLng);
          console.log('📍 마커 위치:', storeLat, storeLng);

          const storeDetail = await getPlaceDetail(placeId, userLat, userLng);
          setSelectedStore(storeDetail);
          setIsBottomSheetOpen(true);
        },
        (err) => {
          console.error('❌ 사용자 위치 가져오기 실패:', err);
        }
      );
    } catch (error) {
      console.error('상세 정보 불러오기 실패:', error);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-white">
      {/* 지도 영역 */}
      <MapContainer
        ref={mapRef}
        isBookmarkOnly={isBookmarkOnly}
        categoryCodes={categoryCodes}
        benefitCategories={benefitCategories}
        shouldRestoreLocation={false}
        onMarkerClick={handleMarkerClick}
      />

      {/* 상단 검색바 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-[393px] px-2.5">
        <SearchBar />
      </div>

      {/* 좌측 하단 버튼 그룹 */}
      <MapActionButtons
        onEventClick={() => setIsEventOpen(true)}
        onBarcodeClick={() => setIsBarcodeOpen(true)}
        onCouponClick={() => setIsCouponOpen(true)}
      />
      {/* 우측 하단 위치 버튼 */}
      <MapLocationButton onClick={handleCurrentLocation} />

      {/* 우측 상단 필터링/즐겨찾기 버튼 */}
      <MapTopRightButtons
        onToggleFilter={() => setIsFilterOpen(true)}
        onToggleBookmark={() => setIsBookmarkOnly((prev) => !prev)}
        isBookmarkOnly={isBookmarkOnly}
        categoryCodes={categoryCodes}
        benefitCategories={benefitCategories}
      />
      <BottomSheetEvent isOpen={isEventOpen} onClose={() => setIsEventOpen(false)} />
      <BottomSheetCoupon
        isOpen={isCouponOpen}
        onClose={() => setIsCouponOpen(false)}
        mapRef={mapRef}
      />
      <BottomSheetBarcode
        userName={displayName}
        userGrade={gradeForComponent}
        barcodeValue={barcodeValue}
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
      />

      <BottomSheetFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(categories, benefits) => {
          setCategoryCodes(categories);
          setBenefitCategories(benefits);
        }}
        selectedCategoryCodes={categoryCodes}
        selectedBenefitCategories={benefitCategories}
      />

      {/* 바텀시트 - store가 있을 때만 렌더 */}
      {selectedStore && (
        <BottomSheetLocationDetail
          store={selectedStore}
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          mapRef={mapRef}
        />
      )}
    </div>
  );
};

export default MapPage;
