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
import { getPlacesForSearch } from '@/apis/getPlaces';
import BottomSheetSearchList from '@/components/map/BottomSheetSearchList';
import type { Place } from '@/types/map';
import { showInfoToast } from '@/utils/toast';

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
    'CAFE',
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
            setTimeout(() => focusOnStore(), 300);
            return;
          }

          try {
            map.deselectMarker?.();
            map.setCenter(focusStore.latitude, focusStore.longitude);

            setTimeout(() => {
              map.setSelectedMarker(focusStore.placeId);

              handleMarkerClick(
                focusStore.placeId,
                String(focusStore.latitude),
                String(focusStore.longitude)
              );
            }, 600);
          } catch (error) {
            console.error('지도 중심 이동 실패:', error);
          }
        };

        setTimeout(() => {
          focusOnStore();
        }, 500);
      } else if (focusStore.searchKeyword) {
        const performSearch = async () => {
          try {
            setSearchKeyword(focusStore.searchKeyword);
            const map = mapRef.current;
            if (!map || !map.getBounds) {
              setTimeout(() => performSearch(), 500);
              return;
            }

            const bounds = map.getBounds();
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();
            const centerLat = (sw.getLat() + ne.getLat()) / 2;
            const centerLng = (sw.getLng() + ne.getLng()) / 2;

            setCurrentLat(centerLat);
            setCurrentLng(centerLng);

            const delta = 0.09;
            const swLat = centerLat - delta;
            const swLng = centerLng - delta;
            const neLat = centerLat + delta;
            const neLng = centerLng + delta;

            const results = await getPlacesForSearch({
              keyword: focusStore.searchKeyword,
              southWestLatitude: swLat,
              southWestLongitude: swLng,
              northEastLatitude: neLat,
              northEastLongitude: neLng,
            });

            if (results.length > 0) {
              setSearchResults(results);
              setSearchOpen(true);

              const exactMatch = results.find((result) => result.placeId === focusStore.placeId);

              const nameMatch = !exactMatch
                ? results.find(
                    (result) =>
                      result.placeName.includes(focusStore.placeName) ||
                      focusStore.placeName.includes(result.placeName)
                  )
                : null;

              const matchedStore = exactMatch || nameMatch;

              if (matchedStore) {
                setTimeout(() => {
                  handleMarkerClick(
                    matchedStore.placeId,
                    String(matchedStore.latitude),
                    String(matchedStore.longitude)
                  );
                }, 1000);
              }
            } else {
              showInfoToast(`'${focusStore.placeName}' 매장을 찾을 수 없습니다.`);
            }
          } catch (error) {
            console.error('북마크 위치 검색 실패:', error);
            showInfoToast('매장 검색 중 오류가 발생했습니다.');
          }
        };

        performSearch();
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
    if (!keyword.trim()) return;
    setSearchKeyword(keyword);
    setSearchOpen(true);

    const map = mapRef.current;
    if (!map || !map.getBounds) return;

    const bounds = map.getBounds?.();
    if (!bounds) return;

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const centerLat = (sw.getLat() + ne.getLat()) / 2;
    const centerLng = (sw.getLng() + ne.getLng()) / 2;

    setCurrentLat(centerLat);
    setCurrentLng(centerLng);

    const delta = 0.09;

    const swLat = centerLat - delta;
    const swLng = centerLng - delta;
    const neLat = centerLat + delta;
    const neLng = centerLng + delta;

    try {
      const results = await getPlacesForSearch({
        keyword,
        southWestLatitude: swLat,
        southWestLongitude: swLng,
        northEastLatitude: neLat,
        northEastLongitude: neLng,
      });

      console.log('🔍 검색 결과:', results);
      if (results.length === 0) {
        showInfoToast('검색 결과가 없습니다.');
        return;
      }

      setSearchResults(results);
    } catch (e) {
      console.error('검색 중 오류:', e);
    }
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
          setUserLocation({ latitude: userLat, longitude: userLng });
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
        onMarkerDeselect={() => {}}
      />

      {/* 상단 검색바 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 w-full max-w-[393px] px-2.5">
        <SearchBar onSearch={handleSearch} />
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

      {/* 바텀시트 - store가 있을 때만 렌더 */}
      {selectedStore && userLocation && (
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

      {/* 검색 결과 바텀시트 */}
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
          onBookmarkToggle={(placeId) => {
            console.log('Bookmark toggled:', placeId);
          }}
          onCouponDownloaded={() => {
            console.log('Coupon downloaded');
          }}
          onCouponClick={(userCouponId, brand) => {
            console.log('Coupon clicked:', userCouponId, brand);
          }}
          mapRef={mapRef}
          onMarkerClick={handleMarkerClick}
        />
      )}
    </div>
  );
};

export default MapPage;
