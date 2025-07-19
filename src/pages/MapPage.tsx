import { useState } from 'react';
import MapContainer from '@/components/map/MapContainer';
import SearchBar from '@/components/common/SearchBar';
import MapActionButtons from '@/components/map/MapActionButtons';
import MapTopRightButtons from '@/components/map/MapTopRightButtons';
import BottomSheetEvent from '@/components/map/BottomSheetEvent';
import BottomSheetBarcode from '@/components/common/BottomSheetBarcode';

const MapPage = () => {
  const [isBookmarkOnly, setIsBookmarkOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-white">
      {/* 지도 영역 */}
      <MapContainer />

      {/* 상단 검색바 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-[393px] px-2.5">
        <SearchBar />
      </div>

      {/* 좌측 하단 버튼 그룹 */}
      <MapActionButtons
        onEventClick={() => setIsEventOpen(true)}
        onBarcodeClick={() => setIsBarcodeOpen(true)}
      />

      {/* 우측 상단 버튼 */}
      <MapTopRightButtons
        onToggleFilter={() => setIsFilterOpen(true)}
        onToggleBookmark={() => setIsBookmarkOnly((prev) => !prev)}
        isBookmarkOnly={isBookmarkOnly}
      />

      {isFilterOpen && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] h-[300px] bg-white shadow-lg z-30 rounded-t-xl border border-gray-200">
          <p className="text-center text-sm text-gray-500 pt-4">[모의] 필터 바텀시트입니다</p>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="mt-6 mx-auto block px-4 py-2 text-sm bg-gray-100 rounded-md"
          >
            닫기
          </button>
        </div>
      )}
      <BottomSheetEvent isOpen={isEventOpen} onClose={() => setIsEventOpen(false)} />
      <BottomSheetBarcode
        userName="김누비"
        userGrade="VIP"
        barcodeValue="123456789"
        isOpen={isBarcodeOpen}
        onClose={() => setIsBarcodeOpen(false)}
      />
    </div>
  );
};

export default MapPage;
