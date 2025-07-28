import { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import type { KakaoMap, KakaoCustomOverlay } from '@/types/kakao';
import type { Place } from '@/apis/getPlaces';
import { getPlaces } from '@/apis/getPlaces'; // API 호출 함수와 반환 타입을 가져옵니다.
import MapMarkerIcon from '@/components/common/MapMarkerIcon';
import BookmarkCard from '@/components/JuniorPage/BookmarkCard'; // 정보창에 사용할 카드 컴포넌트

// 컴포넌트 Props 정의
interface MapContainerProps {
  onMarkerSelect?: (place: Place) => void;
  onBookmarkToggle?: (placeId: number) => void;
  // 외부에서 북마크가 변경되었을 때 UI를 업데이트하기 위해 places 배열을 prop으로 받을 수도 있습니다.
  // 이 예제에서는 컴포넌트가 직접 데이터를 fetching합니다.
}

const MapContainer = ({ onMarkerSelect, onBookmarkToggle }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  // --- 상태(State) 및 참조(Ref) 관리 ---
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [infoOverlay, setInfoOverlay] = useState<KakaoCustomOverlay | null>(null);

  const markerOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const markerRootsRef = useRef<any[]>([]); // 마커의 React Root 인스턴스 정리용

  // --- 함수 정의 (useCallback으로 최적화) ---

  // 정보창 닫기 함수
  const closeInfoWindow = useCallback(() => {
    infoOverlay?.setMap(null);
    setInfoOverlay(null);
    setSelectedPlaceId(null);
  }, [infoOverlay]);

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback(
    (place: Place) => {
      if (selectedPlaceId === place.placeId) {
        closeInfoWindow();
        return;
      }
      closeInfoWindow(); // 다른 마커 클릭 시 기존 정보창 닫기

      if (!map) return;

      const contentNode = document.createElement('div');
      const root = ReactDOM.createRoot(contentNode);
      root.render(
        <BookmarkCard
          store={place} // BookmarkCard가 Place 타입과 호환된다고 가정
          variant="compact"
          onBookmarkToggle={() => onBookmarkToggle?.(place.placeId)}
        />
      );

      // 정보창이 마커를 가리지 않도록 위치를 조정
      const positionOffset = 0.002;
      const newInfoOverlay = new window.kakao.maps.CustomOverlay({
        content: contentNode,
        position: new window.kakao.maps.LatLng(place.latitude, place.longitude + positionOffset),
        xAnchor: 0,
        yAnchor: 1.1,
        zIndex: 150,
        clickable: true,
      });

      newInfoOverlay.setMap(map);
      setInfoOverlay(newInfoOverlay);
      setSelectedPlaceId(place.placeId);

      // 정보창이 잘 보이도록 지도 중심 이동
      const halfInfoWindowWidth = 0.0022;
      const newCenterLng = place.longitude + positionOffset + halfInfoWindowWidth;
      map.panTo(new window.kakao.maps.LatLng(place.latitude, newCenterLng));

      onMarkerSelect?.(place);
    },
    [map, selectedPlaceId, closeInfoWindow, onMarkerSelect, onBookmarkToggle]
  );

  // 지도 영역 내 장소 데이터 불러오기 함수
  const fetchPlacesInViewport = useCallback(async () => {
    if (!map) return;
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
  }, [map]);

  // --- useEffect 훅 ---

  // 1. 지도 초기화 (최초 1회 실행)
  useEffect(() => {
    if (!kakaoMapKey) {
      console.error('Kakao Map API Key is missing');
      return;
    }

    const initializeMap = () => {
      const container = mapRef.current;
      if (!container) return;

      const mapInstance = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.544581, 127.055961), // 초기 중심 (원 중심)
        level: 5,
      });

      // ✅ 여기에 원(Circle)을 추가합니다.
      const circle = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(37.544581, 127.055961),
        radius: 500, // 500m
        strokeWeight: 5,
        strokeColor: '#DFA2A2',
        strokeOpacity: 1,
        strokeStyle: 'dashed',
        fillColor: '#F316B0',
        fillOpacity: 0.08,
      });
      circle.setMap(mapInstance);

      // ✅ 원의 경계를 가져와 지도 범위를 재설정하여 원이 완전히 보이도록 합니다.
      const bounds = circle.getBounds();
      mapInstance.setBounds(bounds);

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

  // 2. 지도 이벤트 리스너 설정 (지도 로딩 후)
  useEffect(() => {
    if (!map) return;
    // 지도 idle 이벤트: 지도 이동/확대가 멈추면 데이터 로딩
    const idleListener = window.kakao.maps.event.addListener(map, 'idle', fetchPlacesInViewport);
    // 지도 click 이벤트: 정보창 닫기
    const clickListener = window.kakao.maps.event.addListener(map, 'click', closeInfoWindow);

    fetchPlacesInViewport(); // 최초 데이터 로딩

    return () => {
      window.kakao.maps.event.removeListener(map, 'idle', idleListener);
      window.kakao.maps.event.removeListener(map, 'click', clickListener);
    };
  }, [map, fetchPlacesInViewport, closeInfoWindow]);

  // 3. places 데이터 변경 시 정보창 업데이트 (북마크 상태 동기화용)
  useEffect(() => {
    if (infoOverlay && selectedPlaceId) {
      const selectedPlace = places.find((p) => p.placeId === selectedPlaceId);
      if (selectedPlace) {
        const contentNode = document.createElement('div');
        const root = ReactDOM.createRoot(contentNode);
        root.render(
          <BookmarkCard
            store={selectedPlace}
            variant="compact"
            onBookmarkToggle={() => onBookmarkToggle?.(selectedPlace.placeId)}
          />
        );
        infoOverlay.setContent(contentNode);
      }
    }
  }, [places, infoOverlay, selectedPlaceId, onBookmarkToggle]);

  // 4. 마커 렌더링 (places 또는 selectedPlaceId 변경 시)
  useEffect(() => {
    if (!map) return;

    // 기존 마커 및 React Root 정리
    markerOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    markerRootsRef.current.forEach((root) => root.unmount());
    markerOverlaysRef.current = [];
    markerRootsRef.current = [];

    places.forEach((place) => {
      const isSelected = place.placeId === selectedPlaceId;
      const contentNode = document.createElement('div');
      contentNode.style.cursor = 'pointer';
      const root = ReactDOM.createRoot(contentNode);

      root.render(
        <MapMarkerIcon
          category={place.categoryCode}
          storeClass={place.markerCode}
          event={place.eventCode}
          isSelected={isSelected}
          onClick={() => handleMarkerClick(place)}
        />
      );

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(place.latitude, place.longitude),
        content: contentNode,
        yAnchor: 1,
        zIndex: isSelected ? 100 : 10, // 선택된 마커가 더 위에 오도록 zIndex 조정
      });

      customOverlay.setMap(map);
      markerOverlaysRef.current.push(customOverlay);
      markerRootsRef.current.push(root);
    });
  }, [map, places, selectedPlaceId, handleMarkerClick]);

  return <div ref={mapRef} className="w-full h-full absolute top-0 left-0 z-0" />;
};

export default MapContainer;
