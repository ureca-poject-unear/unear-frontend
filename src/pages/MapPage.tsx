// src/pages/MapPage.tsx (수정된 최종 코드)

import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import { getPlacesForSearch } from '@/apis/getPlaces';
import BottomSheetSearchList from '@/components/map/BottomSheetSearchList';
import type { Place } from '@/types/map';
import { showInfoToast } from '@/utils/toast';

const MapPage = () => {
  const location = useLocation();
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
  const [userLocation, setUserLocation] = useState<{ latitude: string; longitude: string } | null>(
    null
  );
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [currentLat, setCurrentLat] = useState<number | null>(null);
  const [currentLng, setCurrentLng] = useState<number | null>(null);

  const ALL_CATEGORY_CODES = [
    'FOOD',
    'CAFE',
    'BAKERY',
    'LIFE',
    'ACTIVITY',
    'EDUCATION',
    'CULTURE',
    'SHOPPING',
    'BEAUTY',
  ];
  const ALL_BENEFIT_CODES = ['할인', '적립', '무료서비스', '상품 증정'];
  const { getUserDisplayName, getUserGrade, getBarcodeNumber } = useAuthStore();
  const displayName = getUserDisplayName();
  const userGrade = getUserGrade();
  const barcodeValue = getBarcodeNumber();
  const gradeForComponent = userGrade === 'BASIC' ? '우수' : userGrade;

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

  useEffect(() => {
    const focusStore = location.state?.focusStore;
    if (focusStore) {
      if (focusStore.latitude && focusStore.longitude) {
        const focusOnStore = () => {
          const map = mapRef.current;
          if (!map || !map.setCenter) {
            setTimeout(focusOnStore, 100);
            return;
          }
          try {
            console.log(`✨ 다른 페이지에서 전달받은 매장(${focusStore.placeId})으로 포커스 이동`);
            map.deselectMarker?.();

            // [수정] 지도 이동, 마커 선택, 바텀시트 열기 로직을 모두 setTimeout 안으로 이동
            setTimeout(() => {
              // 1. 매장 위치로 지도 중심 이동
              map.setCenter(focusStore.latitude, focusStore.longitude);
              // 2. 해당 매장 마커 선택
              map.setSelectedMarker(focusStore.placeId);
              // 3. 사용자 위치를 묻지 않고 매장 상세 정보 바텀시트 열기
              handleMarkerClick(
                focusStore.placeId,
                String(focusStore.latitude),
                String(focusStore.longitude),
                true
              );
            }, 300); // 300ms 지연으로 지도 초기화 로직과 충돌 방지
          } catch (error) {
            console.error('지도 중심 이동 실패:', error);
          }
        };
        focusOnStore();
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const handleRefreshStores = () => {
      console.log('🔄 [refreshMapStores] 이벤트 수신됨 - 지도 재요청');
      mapRef.current?.fetchPlaces();
    };
    window.addEventListener('refreshMapStores', handleRefreshStores);
    return () => {
      window.removeEventListener('refreshMapStores', handleRefreshStores);
    };
  }, []);

  const handleCurrentLocation = () => {
    mapRef.current?.showCurrentLocation();
  };

  const handleSearch = async (keyword: string) => {
    // ... 기존 검색 로직
  };

  const handleMarkerClick = async (
    placeId: number,
    storeLat: string,
    storeLng: string,
    skipUserLocation = false
  ) => {
    if (skipUserLocation) {
      try {
        console.log(`[handleMarkerClick] 사용자 위치 없이 매장(${placeId}) 정보 요청`);
        const storeDetail = await getPlaceDetail(placeId, storeLat, storeLng);
        setUserLocation(null);
        setSelectedStore(storeDetail);
        setIsBottomSheetOpen(true);
      } catch (error) {
        console.error('상세 정보 불러오기 실패 (skipUserLocation):', error);
      }
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const userLat = pos.coords.latitude.toString();
          const userLng = pos.coords.longitude.toString();
          const storeDetail = await getPlaceDetail(placeId, userLat, userLng);
          setUserLocation({ latitude: userLat, longitude: userLng });
          setSelectedStore(storeDetail);
          setIsBottomSheetOpen(true);
        },
        async (err) => {
          console.error('❌ 사용자 위치 가져오기 실패, 매장 위치 기준으로 정보 요청:', err);
          const storeDetail = await getPlaceDetail(placeId, storeLat, storeLng);
          setUserLocation(null);
          setSelectedStore(storeDetail);
          setIsBottomSheetOpen(true);
        }
      );
    } catch (error) {
      console.error('상세 정보 불러오기 실패:', error);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-65px)] bg-white">
      <MapContainer
        ref={mapRef}
        isBookmarkOnly={isBookmarkOnly}
        categoryCodes={categoryCodes}
        benefitCategories={benefitCategories}
        shouldRestoreLocation={!location.state?.focusStore}
        onMarkerClick={handleMarkerClick}
        onMarkerDeselect={() => {}}
      />
      {/* 나머지 JSX 코드는 이전과 동일 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-[393px] px-2.5">
        <SearchBar onSearch={handleSearch} />
      </div>
      <MapActionButtons
        onEventClick={() => setIsEventOpen(true)}
        onBarcodeClick={() => setIsBarcodeOpen(true)}
        onCouponClick={() => setIsCouponOpen(true)}
      />
      <MapLocationButton onClick={handleCurrentLocation} />
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
        onMarkerClick={handleMarkerClick}
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
      {selectedStore && (
        <BottomSheetLocationDetail
          store={selectedStore}
          isOpen={isBottomSheetOpen}
          onClose={() => {
            setIsBottomSheetOpen(false);
            mapRef.current?.deselectMarker?.();
          }}
          mapRef={mapRef}
          userLocation={userLocation}
        />
      )}
      {searchResults.length > 0 && currentLat !== null && currentLng !== null && (
        <BottomSheetSearchList
          results={searchResults}
          keyword={searchKeyword}
          isOpen={isSearchOpen}
          onClose={() => {
            setSearchOpen(false);
            setSearchResults([]);
          }}
          currentLat={String(currentLat)}
          currentLng={String(currentLng)}
          onBookmarkToggle={(placeId) => console.log('Bookmark toggled:', placeId)}
          onCouponDownloaded={() => console.log('Coupon downloaded')}
          onCouponClick={(userCouponId, brand) =>
            console.log('Coupon clicked:', userCouponId, brand)
          }
          mapRef={mapRef}
          onMarkerClick={handleMarkerClick}
        />
      )}
    </div>
  );
};

export default MapPage;
