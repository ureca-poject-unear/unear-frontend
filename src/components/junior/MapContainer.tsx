import { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import type { CategoryType, StoreClassType, EventType } from '@/components/common/MapMarkerIcon';
import MapMarkerIcon from '@/components/common/MapMarkerIcon';
import BookmarkCard, { type StoreInfo } from '@/components/junior/BookmarkCard';

// 타입 정의
type MarkerStoreData = StoreInfo & {
  lat: number;
  lng: number;
};

// 초기 데이터
const initialStoreMarkers: MarkerStoreData[] = [
  {
    id: 'marker1',
    lat: 37.545581,
    lng: 127.056961,
    name: '스타벅스 성수점',
    address: '서울 성동구 성수이로 118',
    distance: '0.1km',
    hours: '07:00 - 22:00',
    category: 'CAFE',
    storeClass: 'BRAND',
    event: 'REQUIRE',
    status: '영업중',
    isBookmarked: true,
  },
  {
    id: 'marker2',
    lat: 37.543581,
    lng: 127.054961,
    name: '성수밀도',
    address: '서울 성동구 서울숲2길 19-1',
    distance: '0.3km',
    hours: '11:00 - 21:00',
    category: 'FOOD',
    storeClass: 'LOCAL',
    event: 'GENERAL',
    status: '영업중',
    isBookmarked: false,
  },
  {
    id: 'marker3',
    lat: 37.546081,
    lng: 127.053961,
    name: '포인트오브뷰 서울',
    address: '서울 성동구 연무장길 18',
    distance: '0.4km',
    hours: '12:00 - 20:00',
    category: 'SHOPPING',
    storeClass: 'LOCAL',
    event: 'GENERAL',
    status: '휴무',
    isBookmarked: true,
  },
];

const MapContainer = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const overlaysRef = useRef<any[]>([]);
  const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  const [map, setMap] = useState<any>(null);
  const [infoOverlay, setInfoOverlay] = useState<any>(null);
  const [markersData, setMarkersData] = useState(initialStoreMarkers);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const closeInfoWindow = useCallback(() => {
    if (infoOverlay) {
      infoOverlay.setMap(null);
    }
    setInfoOverlay(null);
    setSelectedMarkerId(null);
  }, [infoOverlay]);

  const handleBookmarkToggle = (storeId: string) => {
    setMarkersData((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === storeId ? { ...marker, isBookmarked: !marker.isBookmarked } : marker
      )
    );
  };

  const handleMarkerClick = (markerId: string) => {
    if (selectedMarkerId === markerId) {
      closeInfoWindow();
      return;
    }

    if (infoOverlay) {
      infoOverlay.setMap(null);
    }

    const markerInfo = markersData.find((m) => m.id === markerId);
    if (!markerInfo || !map) return;

    const contentNode = document.createElement('div');
    const root = ReactDOM.createRoot(contentNode);
    root.render(
      <BookmarkCard store={markerInfo} variant="compact" onBookmarkToggle={handleBookmarkToggle} />
    );

    const gapOffset = 0.001;
    const infoWindowCenterOffset = 0.0007;

    const newInfoOverlay = new window.kakao.maps.CustomOverlay({
      content: contentNode,
      position: new window.kakao.maps.LatLng(markerInfo.lat, markerInfo.lng + gapOffset),
      xAnchor: 0,
      yAnchor: 1.5,
      zIndex: 50,
    });

    newInfoOverlay.setMap(map);
    setInfoOverlay(newInfoOverlay);
    setSelectedMarkerId(markerId);

    const panToTargetLng = markerInfo.lng + gapOffset + infoWindowCenterOffset;
    map.panTo(new window.kakao.maps.LatLng(markerInfo.lat, panToTargetLng));
  };

  // 카카오맵 스크립트 로딩을 위한 useEffect
  useEffect(() => {
    if (map || !kakaoMapKey) return;

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;
        const options = {
          center: new window.kakao.maps.LatLng(37.544581, 127.055961),
          level: 4,
        };
        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);
      });
    };
  }, [kakaoMapKey, map]);

  // 맵 클릭 시 인포윈도우를 닫기 위한 useEffect
  useEffect(() => {
    if (!map) return;
    const handleMapClickHandler = () => closeInfoWindow();
    const listener = window.kakao.maps.event.addListener(map, 'click', handleMapClickHandler);
    return () => {
      window.kakao.maps.event.removeListener(map, 'click', listener);
    };
  }, [map, closeInfoWindow]);

  // 즐겨찾기 상태가 변경되었을 때, 열려있는 인포윈도우의 컨텐츠를 다시 렌더링
  useEffect(() => {
    if (infoOverlay && selectedMarkerId) {
      const markerInfo = markersData.find((m) => m.id === selectedMarkerId);
      if (markerInfo) {
        const contentNode = document.createElement('div');
        const root = ReactDOM.createRoot(contentNode);
        root.render(
          <BookmarkCard
            store={markerInfo}
            variant="compact"
            onBookmarkToggle={handleBookmarkToggle}
          />
        );
        infoOverlay.setContent(contentNode);
      }
    }
  }, [markersData, infoOverlay, selectedMarkerId]);

  // 마커 및 원을 지도에 그리는 useEffect
  useEffect(() => {
    if (!map) return;

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    const circle = new window.kakao.maps.Circle({
      center: new window.kakao.maps.LatLng(37.544581, 127.055961),
      radius: 300,
      strokeWeight: 5,
      strokeColor: '#DFA2A2',
      strokeOpacity: 1,
      strokeStyle: 'dashed',
      fillColor: '#F316B0',
      fillOpacity: 0.08,
    });
    circle.setMap(map);

    markersData.forEach((markerInfo) => {
      const contentNode = document.createElement('div');
      const root = ReactDOM.createRoot(contentNode);
      const isSelected = selectedMarkerId === markerInfo.id;
      const zIndex = isSelected ? 100 : 1;

      root.render(
        <MapMarkerIcon
          category={markerInfo.category}
          storeClass={markerInfo.storeClass}
          event={markerInfo.event}
          isSelected={isSelected}
          onClick={() => handleMarkerClick(markerInfo.id)}
        />
      );

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(markerInfo.lat, markerInfo.lng),
        content: contentNode,
        yAnchor: 1,
        zIndex: zIndex,
      });

      customOverlay.setMap(map);
      overlaysRef.current.push(customOverlay);
    });

    return () => {
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      circle.setMap(null);
    };
  }, [map, markersData, selectedMarkerId]);

  return <div ref={mapRef} className="w-full h-full absolute top-0 left-0 z-0" />;
};

export default MapContainer;
