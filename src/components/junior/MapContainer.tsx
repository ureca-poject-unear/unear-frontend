// src/components/junior/MapContainer.tsx (수정된 코드)

import { useEffect, useRef, useState } from 'react';
import ReactDOM, { type Root } from 'react-dom/client';
import type { KakaoMap, KakaoCustomOverlay } from '@/types/kakao';
import type { Place } from '@/types/map';
import { getPlaces } from '@/apis/getPlaces';
import MapMarkerIcon from '@/components/common/MapMarkerIcon';

const MapContainer = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  const [map, setMap] = useState<KakaoMap | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);

  const markerOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const markerRootsRef = useRef<Root[]>([]);

  // 1. 지도 초기화 Hook
  useEffect(() => {
    if (!kakaoMapKey) {
      console.error('Kakao Map API Key is missing');
      return;
    }
    const initializeMap = () => {
      const container = mapRef.current;
      if (!container) return;

      // [수정] 지도 생성 시 옵션에서는 draggable과 zoomable을 제거합니다.
      const mapInstance = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.544581, 127.055961),
        level: 6,
      });

      // [수정] 지도 인스턴스가 생성된 후, setDraggable과 setZoomable 메소드를 호출하여 기능을 비활성화합니다.
      mapInstance.setDraggable(false);
      mapInstance.setZoomable(false);

      const circle = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(37.544581, 127.055961),
        radius: 800,
        strokeWeight: 5,
        strokeColor: '#DFA2A2',
        strokeOpacity: 1,
        strokeStyle: 'shortdash',
        fillColor: '#F316B0',
        fillOpacity: 0.08,
      });
      circle.setMap(mapInstance);
      const bounds = circle.getBounds();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mapInstance as any).setBounds(bounds);
      setMap(mapInstance);
    };
    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => window.kakao.maps.load(initializeMap);
    }
  }, [kakaoMapKey]);

  // 2. 지도 초기화 후 장소 데이터 한 번만 불러오는 Hook
  useEffect(() => {
    if (!map) return;
    const fetchInitialPlaces = async () => {
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      try {
        const fetchedPlaces = await getPlaces({
          swLat: sw.getLat(),
          swLng: sw.getLng(),
          neLat: ne.getLat(),
          neLng: ne.getLng(),
        });
        const eventPlaces = fetchedPlaces.filter((p) => p.eventCode !== 'NONE');
        setPlaces(eventPlaces);
      } catch (error) {
        console.error('지도 영역 내 장소 가져오기 실패:', error);
      }
    };
    fetchInitialPlaces();
  }, [map]);

  // 3. 장소 데이터에 따라 마커를 렌더링하는 Hook
  useEffect(() => {
    if (!map) return;
    markerOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    markerRootsRef.current.forEach((root) => {
      setTimeout(() => root.unmount(), 0);
    });
    markerOverlaysRef.current = [];
    markerRootsRef.current = [];
    places.forEach((place) => {
      const contentNode = document.createElement('div');
      const root = ReactDOM.createRoot(contentNode);
      root.render(
        <MapMarkerIcon
          category={place.categoryCode}
          storeClass={place.markerCode}
          event={place.eventCode}
          isSelected={false}
        />
      );
      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(place.latitude, place.longitude),
        content: contentNode,
        yAnchor: 1,
      });
      customOverlay.setMap(map);
      markerOverlaysRef.current.push(customOverlay);
      markerRootsRef.current.push(root);
    });
  }, [map, places]);

  return <div ref={mapRef} className="w-full h-full absolute top-0 left-0 z-0" />;
};

export default MapContainer;
