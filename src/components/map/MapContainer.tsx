import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import type { KakaoMap, KakaoCustomOverlay, KakaoCircle } from '@/types/kakao';
import CurrentLocationMarker from '@/components/map/CurrentLocationMarker';
import axiosInstance from '@/apis/axiosInstance';
import MapMarkerIcon from '../common/MapMarkerIcon';

export interface MapContainerRef {
  showCurrentLocation: () => void;
}

interface MapContainerProps {
  isBookmarkOnly: boolean;
  categoryCode: string | null;
  benefitCategory: string | null;
  shouldRestoreLocation: boolean;
}

const MapContainer = forwardRef<MapContainerRef, MapContainerProps>(
  ({ isBookmarkOnly, categoryCode, benefitCategory, shouldRestoreLocation }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;
    const mapInstanceRef = useRef<KakaoMap | null>(null);
    const overlayRef = useRef<KakaoCustomOverlay | null>(null);
    const markersRef = useRef<KakaoCustomOverlay[]>([]);
    const currentLocationRef = useRef<{ lat: number; lng: number } | null>(null);
    const [isLocationShown, setIsLocationShown] = useState(false);
    const fetchPlacesInViewportRef = useRef<() => void>(() => {});
    const staticCircleRef = useRef<KakaoCircle | null>(null);
    interface Place {
      id: number;
      latitude: number;
      longitude: number;
      categoryCode: CategoryType;
      markerCode: StoreClassType;
      eventCode: EventType;
      benefitCategory: string;
      favorite: boolean;
    }

    type CategoryType =
      | 'FOOD'
      | 'ACTIVITY'
      | 'EDUCATION'
      | 'CULTURE'
      | 'BAKERY'
      | 'LIFE'
      | 'SHOPPING'
      | 'CAFE'
      | 'BEAUTY'
      | 'POPUP';

    type StoreClassType = 'LOCAL' | 'FRANCHISE' | 'BASIC';
    type EventType = 'NONE' | 'GENERAL' | 'REQUIRE';

    const renderCurrentLocation = (lat: number, lng: number) => {
      const currentLatLng = new window.kakao.maps.LatLng(lat, lng);
      const map = mapInstanceRef.current;
      if (!map) return;

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
    }));

    useEffect(() => {
      fetchPlacesInViewportRef.current = async () => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const bounds = map.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        try {
          const res = await axiosInstance.get('/places', {
            params: {
              southWestLatitude: sw.getLat(),
              southWestLongitude: sw.getLng(),
              northEastLatitude: ne.getLat(),
              northEastLongitude: ne.getLng(),
              isFavorite: isBookmarkOnly ? 'true' : undefined,
              categoryCode: categoryCode ?? undefined,
              benefitCategory: benefitCategory ?? undefined,
            },
          });

          const places: Place[] = res.data?.data || [];

          markersRef.current.forEach((marker) => marker.setMap(null));
          markersRef.current = [];

          places.forEach((place) => {
            const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);

            const markerHTML = ReactDOMServer.renderToString(
              <MapMarkerIcon
                category={place.categoryCode}
                storeClass={place.markerCode}
                event={place.eventCode}
              />
            );

            const el = document.createElement('div');
            el.innerHTML = markerHTML;

            const overlay = new window.kakao.maps.CustomOverlay({
              position,
              content: el.firstElementChild as Node,
              yAnchor: 1,
              zIndex: 1,
            });

            overlay.setMap(map);
            markersRef.current.push(overlay);
          });

          if (!isLocationShown && currentLocationRef.current) {
            renderCurrentLocation(currentLocationRef.current.lat, currentLocationRef.current.lng);
          }
        } catch (error) {
          console.error('장소 가져오기 실패:', error);
        }
      };
    }, [isBookmarkOnly, categoryCode, benefitCategory, isLocationShown]);

    useEffect(() => {
      if (!kakaoMapKey) {
        console.error('Kakao Map API Key is missing');
        return;
      }

      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            const container = mapRef.current;
            if (!container) return;

            const options = {
              center: new window.kakao.maps.LatLng(37.555, 126.822),
              level: 4,
            };

            const map = new window.kakao.maps.Map(container, options);
            mapInstanceRef.current = map;

            const staticCircle = new window.kakao.maps.Circle({
              center: new window.kakao.maps.LatLng(37.544581, 127.055961),
              radius: 300,
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
              fetchPlacesInViewportRef.current();
            });

            fetchPlacesInViewportRef.current();
          });
        }
      };

      return () => {
        document.head.removeChild(script);
        // 정리
        if (staticCircleRef.current) {
          staticCircleRef.current.setMap(null);
        }
      };
    }, [kakaoMapKey]);

    useEffect(() => {
      if (mapInstanceRef.current) {
        fetchPlacesInViewportRef.current();
      }
    }, [isBookmarkOnly, categoryCode, benefitCategory]);

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
