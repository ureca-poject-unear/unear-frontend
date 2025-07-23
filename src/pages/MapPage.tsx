import { useRef, useState } from 'react';
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

const MapPage = () => {
  const [isBookmarkOnly, setIsBookmarkOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const mapRef = useRef<MapContainerRef>(null);

  const handleCurrentLocation = () => {
    mapRef.current?.showCurrentLocation();
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-white">
      {/* 지도 영역 */}
      <MapContainer ref={mapRef} />

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
      />
      <BottomSheetEvent isOpen={isEventOpen} onClose={() => setIsEventOpen(false)} />
      <BottomSheetCoupon isOpen={isCouponOpen} onClose={() => setIsCouponOpen(false)} />
      <BottomSheetBarcode
        userName="김누비"
        userGrade="VIP"
        barcodeValue="123456789"
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
      />
      <BottomSheetFilter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
};

export default MapPage;
