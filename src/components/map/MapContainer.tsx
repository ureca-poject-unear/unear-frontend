import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import type { KakaoMap, KakaoCustomOverlay } from '@/types/kakao';
import CurrentLocationMarker from '@/components/map/CurrentLocationMarker';
import axiosInstance from '@/apis/axiosInstance';
import MapMarkerIcon from '../common/MapMarkerIcon';

export interface MapContainerRef {
  showCurrentLocation: () => void;
}

const MapContainer = forwardRef<MapContainerRef, object>((_, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const overlayRef = useRef<KakaoCustomOverlay | null>(null);
  const markersRef = useRef<KakaoCustomOverlay[]>([]);

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

  const showCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 정보 사용을 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentLatLng = new window.kakao.maps.LatLng(latitude, longitude);
        const map = mapInstanceRef.current;
        if (!map) return;

        const markerHTML = ReactDOMServer.renderToString(<CurrentLocationMarker />);
        if (overlayRef.current) {
          overlayRef.current.setPosition(currentLatLng);
        } else {
          const el = document.createElement('div');
          el.innerHTML = markerHTML;

          const overlay = new window.kakao.maps.CustomOverlay({
            position: currentLatLng,
            content: el.firstChild as Node,
            yAnchor: 0.5,
            zIndex: 2,
          });

          overlay.setMap(map);
          overlayRef.current = overlay;
        }

        map.setCenter(currentLatLng);
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

          showCurrentLocation();

          const fetchPlacesInViewport = async () => {
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
                },
              });

              const places: Place[] = res.data?.data || [];
              console.log('📌 장소 목록:', places);

              // 기존 마커 제거
              markersRef.current.forEach((marker) => marker.setMap(null));
              markersRef.current = [];

              // 새 마커 생성
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
                  content: el.firstChild as Node,
                  yAnchor: 1,
                  zIndex: 1,
                });

                overlay.setMap(map);
                markersRef.current.push(overlay);
              });
            } catch (error) {
              console.error('장소 가져오기 실패:', error);
            }
          };

          window.kakao.maps.event.addListener(map, 'idle', fetchPlacesInViewport);
          fetchPlacesInViewport();
        });
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [kakaoMapKey]);

  return <div ref={mapRef} className="w-full h-full absolute top-0 left-0 z-0" />;
});

export default MapContainer;
