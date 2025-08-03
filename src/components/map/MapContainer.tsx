import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import type {
  KakaoMap,
  KakaoCustomOverlay,
  KakaoCircle,
  KakaoMarkerClusterer,
  KakaoMarker,
} from '@/types/kakao';
import CurrentLocationMarker from '@/components/map/CurrentLocationMarker';
import MapMarkerIcon from '../common/MapMarkerIcon';
import { getPlaces } from '@/apis/getPlaces';

export interface MapContainerRef {
  showCurrentLocation: () => void;
  setCenter: (lat: number, lng: number) => void;
  fetchPlaces: () => void;
  getBounds: () => ReturnType<typeof window.kakao.maps.Map.prototype.getBounds> | null;
  deselectMarker?: () => void;
  selectMarker?: (placeId: number) => void;
  setSelectedMarker: (placeId: number) => void;
  getCenter: () => { lat: number; lng: number } | null;
}

interface MapContainerProps {
  isBookmarkOnly: boolean;
  categoryCodes: string[];
  benefitCategories: string[];
  shouldRestoreLocation: boolean;
  onMarkerClick: (placeId: number, latitude: string, longitude: string) => void;
  onMarkerDeselect?: () => void;
}

const MapContainer = forwardRef<MapContainerRef, MapContainerProps>(
  (
    {
      isBookmarkOnly,
      categoryCodes,
      benefitCategories,
      shouldRestoreLocation,
      onMarkerClick,
      onMarkerDeselect,
    },
    ref
  ) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;
    const mapInstanceRef = useRef<KakaoMap | null>(null);
    const overlayRef = useRef<KakaoCustomOverlay | null>(null);
    const currentLocationRef = useRef<{ lat: number; lng: number } | null>(null);
    const [isLocationShown, setIsLocationShown] = useState(false);
    const fetchPlacesInViewportRef = useRef<() => void>(() => {});
    const staticCircleRef = useRef<KakaoCircle | null>(null);
    const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
    const selectedPlaceIdRef = useRef<number | null>(null);
    const isSettingCenterRef = useRef(false);
    const clustererRef = useRef<KakaoMarkerClusterer | null>(null);
    const markerInstancesRef = useRef<KakaoMarker[]>([]);

    const clearSelectedMarker = () => {
      setSelectedPlaceId(null);
      selectedPlaceIdRef.current = null;
      onMarkerDeselect?.();
    };

    const renderCurrentLocation = (lat: number, lng: number) => {
      const currentLatLng = new window.kakao.maps.LatLng(lat, lng);
      const map = mapInstanceRef.current;
      if (!map) return;

      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }

      const markerHTML = ReactDOMServer.renderToString(<CurrentLocationMarker />);
      const el = document.createElement('div');
      el.innerHTML = markerHTML;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: currentLatLng,
        content: el.firstElementChild as Node,
        yAnchor: 0.5,
        zIndex: 2,
      });

      overlay.setMap(map);
      overlayRef.current = overlay;
    };

    const showCurrentLocation = () => {
      if (!navigator.geolocation) {
        alert('이 브라우저는 위치 정보 사용을 지원하지 않습니다.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          currentLocationRef.current = { lat: latitude, lng: longitude };
          renderCurrentLocation(latitude, longitude);
          mapInstanceRef.current?.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
          setIsLocationShown(true);
        },
        (error) => {
          console.error('위치 정보를 가져오지 못했습니다.', error);
          alert('위치 정보를 가져오지 못했습니다.');
        }
      );
    };

    useImperativeHandle(ref, () => ({
      showCurrentLocation,
      deselectMarker: () => {
        clearSelectedMarker();
      },
      setSelectedMarker: (placeId) => {
        setSelectedPlaceId(placeId);
        selectedPlaceIdRef.current = placeId;
      },
      setCenter: (lat, lng) => {
        const map = mapInstanceRef.current;
        if (map) {
          isSettingCenterRef.current = true;
          map.setCenter(new window.kakao.maps.LatLng(lat, lng));
          setTimeout(() => {
            isSettingCenterRef.current = false;
          }, 500);
        }
      },
      fetchPlaces: () => {
        fetchPlacesInViewportRef.current();
      },
      getBounds: () => {
        return mapInstanceRef.current?.getBounds() || null;
      },
      selectMarker: (placeId: number) => {
        setSelectedPlaceId(placeId);
        selectedPlaceIdRef.current = placeId;
      },
      getCenter: () => {
        const map = mapInstanceRef.current;
        if (!map) return null;
        const center = map.getCenter();
        return {
          lat: center.getLat(),
          lng: center.getLng(),
        };
      },
    }));

    const renderMarkers = async () => {
      const map = mapInstanceRef.current;
      const clusterer = clustererRef.current;
      if (!map || !clusterer) return;

      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const currentLevel = map.getLevel();
      try {
        const places = await getPlaces({
          swLat: sw.getLat(),
          swLng: sw.getLng(),
          neLat: ne.getLat(),
          neLng: ne.getLng(),
          isFavorite: isBookmarkOnly,
          categoryCodes,
          benefitCategories,
        });

        markerInstancesRef.current.forEach((m) => m.setMap(null));
        clusterer.removeMarkers(markerInstancesRef.current);
        clusterer.clear();
        markerInstancesRef.current = [];

        if (places.length === 0) {
          if (!isLocationShown && currentLocationRef.current) {
            renderCurrentLocation(currentLocationRef.current.lat, currentLocationRef.current.lng);
          }
          return;
        }

        const newMarkers: KakaoMarker[] = places.map((place) => {
          const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
          const markerHTML = ReactDOMServer.renderToString(
            <MapMarkerIcon
              category={place.categoryCode}
              storeClass={place.markerCode}
              event={place.eventCode}
              isSelected={selectedPlaceId === place.placeId}
            />
          );

          const el = document.createElement('div');
          el.innerHTML = markerHTML;
          const markerElement = el.firstElementChild as HTMLElement;

          if (markerElement) {
            markerElement.addEventListener('click', () => {
              setSelectedPlaceId(place.placeId);
              selectedPlaceIdRef.current = place.placeId;
              onMarkerClick(place.placeId, String(place.latitude), String(place.longitude));
            });
          }

          const customOverlay = new window.kakao.maps.CustomOverlay({
            position,
            content: markerElement,
            yAnchor: 0.5,
            zIndex: 1,
          });

          const marker = new window.kakao.maps.Marker({ position });
          marker.setOpacity(0);

          const originalSetMap = marker.setMap;
          marker.setMap = function (mapInstance) {
            originalSetMap.call(this, mapInstance);
            customOverlay.setMap(mapInstance);
          };

          return marker;
        });

        markerInstancesRef.current = newMarkers;
        console.log(currentLevel, '현재레벨');
        const currentZoom = mapInstanceRef.current?.getLevel?.();

        if (places.length <= 3) {
          newMarkers.forEach((marker) => marker.setMap(map));
        } else if (currentZoom !== undefined && currentZoom <= 6) {
          newMarkers.forEach((marker) => marker.setMap(map));
        } else {
          clusterer.addMarkers(newMarkers);
        }

        if (!isLocationShown && currentLocationRef.current) {
          renderCurrentLocation(currentLocationRef.current.lat, currentLocationRef.current.lng);
        }
      } catch (error) {
        console.error('장소 가져오기 실패:', error);
      }
    };

    useEffect(() => {
      fetchPlacesInViewportRef.current = renderMarkers;
    }, [
      isBookmarkOnly,
      categoryCodes,
      benefitCategories,
      isLocationShown,
      onMarkerClick,
      selectedPlaceId,
    ]);

    useEffect(() => {
      if (mapInstanceRef.current) {
        renderMarkers();
      }
    }, [selectedPlaceId]);

    useEffect(() => {
      if (!kakaoMapKey) {
        console.error('Kakao Map API Key is missing');
        return;
      }

      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=clusterer`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            const container = mapRef.current;
            if (!container) return;

            const map = new window.kakao.maps.Map(container, {
              center: new window.kakao.maps.LatLng(37.555, 126.822),
              level: 4,
            });

            mapInstanceRef.current = map;

            try {
              const clusterer = new window.kakao.maps.MarkerClusterer({
                map,
                averageCenter: true,
                minLevel: 4,
                disableClickZoom: true,
                minClusterSize: 3,
                gridSize: 60,
                calculator: [10, 30, 50, 100, 200],
                styles: [
                  {
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                    borderRadius: '50%',
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    lineHeight: '40px',
                    boxShadow: '0 2px 6px rgba(255, 105, 180, 0.3)',
                    opacity: '0.9',
                  },
                  {
                    width: '50px',
                    height: '50px',
                    background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                    borderRadius: '50%',
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    lineHeight: '50px',
                    boxShadow: '0 3px 8px rgba(255, 105, 180, 0.4)',
                    opacity: '0.9',
                  },
                  {
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                    borderRadius: '50%',
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    lineHeight: '60px',
                    boxShadow: '0 4px 10px rgba(255, 105, 180, 0.5)',
                    opacity: '0.9',
                  },
                  {
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                    borderRadius: '50%',
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    lineHeight: '70px',
                    boxShadow: '0 5px 12px rgba(255, 105, 180, 0.6)',
                    opacity: '0.9',
                  },
                  {
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
                    borderRadius: '50%',
                    color: '#fff',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '22px',
                    lineHeight: '80px',
                    boxShadow: '0 6px 14px rgba(255, 105, 180, 0.7)',
                    opacity: '0.9',
                  },
                ],
              });
              clustererRef.current = clusterer;
            } catch (error) {
              console.error('클러스터러 초기화 실패:', error);
              clustererRef.current = null;
            }

            const staticCircle = new window.kakao.maps.Circle({
              center: new window.kakao.maps.LatLng(37.544581, 127.055961),
              radius: 800,
              strokeWeight: 5,
              strokeColor: '#DFA2A2',
              strokeOpacity: 1,
              strokeStyle: 'shortdash',
              fillColor: '#F316B0',
              fillOpacity: 0.08,
            });
            staticCircle.setMap(map);
            staticCircleRef.current = staticCircle;

            showCurrentLocation();

            window.kakao.maps.event.addListener(map, 'idle', () => {
              if (!isSettingCenterRef.current) {
                renderMarkers();
              }
            });

            renderMarkers();
          });
        }
      };

      return () => {
        document.head.removeChild(script);
        if (staticCircleRef.current) {
          staticCircleRef.current.setMap(null);
        }
        if (clustererRef.current && markerInstancesRef.current.length > 0) {
          clustererRef.current.removeMarkers(markerInstancesRef.current);
        }
        if (overlayRef.current) {
          overlayRef.current.setMap(null);
        }
      };
    }, [kakaoMapKey]);

    useEffect(() => {
      if (mapInstanceRef.current) {
        renderMarkers();
      }
    }, [isBookmarkOnly, categoryCodes, benefitCategories]);

    useEffect(() => {
      if (shouldRestoreLocation && mapInstanceRef.current && currentLocationRef.current) {
        const { lat, lng } = currentLocationRef.current;
        mapInstanceRef.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
      }
    }, [shouldRestoreLocation]);

    return <div ref={mapRef} className="w-full h-full absolute top-0 left-0 z-0" />;
  }
);

export default MapContainer;
