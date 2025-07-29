import { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import type { KakaoMap, KakaoCustomOverlay } from '@/types/kakao';
import type { Place } from '@/apis/getPlaces';
import { getPlaces } from '@/apis/getPlaces';
import { getPlaceDetail } from '@/apis/getPlaceDetail'; // 상세 정보 API 호출 함수
import type { StoreData } from '@/types/storeDetail'; // 상세 정보 타입
import MapMarkerIcon from '@/components/common/MapMarkerIcon';
import BookmarkCard from '@/components/JuniorPage/BookmarkCard'; // 정보창에 사용할 카드 컴포넌트
import type { StoreInfo } from '@/components/JuniorPage/BookmarkCard'; // BookmarkCard가 사용하는 타입
import type {
  CategoryType,
  EventType,
  StoreClassType,
  StoreStatusType,
} from '@/components/common/StoreTypeIcon';

// 컴포넌트 Props 정의
interface MapContainerProps {
  onMarkerSelect?: (place: Place) => void;
  onBookmarkToggle?: (placeId: number) => void;
}

const MapContainer = ({ onMarkerSelect, onBookmarkToggle }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  // --- 상태(State) 및 참조(Ref) 관리 ---
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [infoOverlay, setInfoOverlay] = useState<KakaoCustomOverlay | null>(null);

  // [추가] API로 받아온 상세 정보 및 로딩 상태 관리
  const [detailedStore, setDetailedStore] = useState<StoreData | null>(null);
  const [isInfoLoading, setIsInfoLoading] = useState(false);

  const markerOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const markerRootsRef = useRef<any[]>([]);

  // --- 함수 정의 (useCallback으로 최적화) ---

  // 정보창 닫기 함수
  const closeInfoWindow = useCallback(() => {
    infoOverlay?.setMap(null);
    setInfoOverlay(null);
    setSelectedPlaceId(null);
    setDetailedStore(null); // [추가] 상세 정보 상태 초기화
  }, [infoOverlay]);

  // 마커 클릭 핸들러 (수정됨: API 호출 로직 추가)
  const handleMarkerClick = useCallback(
    async (place: Place) => {
      if (selectedPlaceId === place.placeId) {
        closeInfoWindow();
        return;
      }

      // 기존 정보창을 즉시 닫고 로딩 상태 시작
      closeInfoWindow();
      setSelectedPlaceId(place.placeId);
      setIsInfoLoading(true);

      if (!map) return;

      try {
        // 사용자의 현재 위치 대신 지도의 중심 좌표를 사용
        const center = map.getCenter();
        const fetchedDetails = await getPlaceDetail(
          place.placeId,
          String(center.getLat()),
          String(center.getLng())
        );
        setDetailedStore(fetchedDetails);
      } catch (error) {
        console.error('장소 상세 정보 조회 실패:', error);
        closeInfoWindow(); // 에러 발생 시 정보창 닫기
      } finally {
        setIsInfoLoading(false);
      }

      onMarkerSelect?.(place);
    },
    [map, selectedPlaceId, closeInfoWindow, onMarkerSelect]
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

  // 1. 지도 초기화 (기존과 동일)
  useEffect(() => {
    // ... (이 부분은 기존 코드와 동일합니다)
    if (!kakaoMapKey) {
      console.error('Kakao Map API Key is missing');
      return;
    }

    const initializeMap = () => {
      const container = mapRef.current;
      if (!container) return;

      const mapInstance = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.544581, 127.055961),
        level: 5,
      });

      const circle = new window.kakao.maps.Circle({
        center: new window.kakao.maps.LatLng(37.544581, 127.055961),
        radius: 500,
        strokeWeight: 5,
        strokeColor: '#DFA2A2',
        strokeOpacity: 1,
        strokeStyle: 'dashed',
        fillColor: '#F316B0',
        fillOpacity: 0.08,
      });
      circle.setMap(mapInstance);

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

  // 2. 지도 이벤트 리스너 설정 (기존과 동일)
  useEffect(() => {
    if (!map) return;
    const idleListener = window.kakao.maps.event.addListener(map, 'idle', fetchPlacesInViewport);
    const clickListener = window.kakao.maps.event.addListener(map, 'click', closeInfoWindow);

    fetchPlacesInViewport(); // 최초 데이터 로딩

    return () => {
      window.kakao.maps.event.removeListener(map, 'idle', idleListener);
      window.kakao.maps.event.removeListener(map, 'click', clickListener);
    };
  }, [map, fetchPlacesInViewport, closeInfoWindow]);

  // 3. [수정됨] 상세 정보 로드 완료 시 정보창(CustomOverlay) 렌더링
  useEffect(() => {
    if (!map || !selectedPlaceId) return;

    // 로딩 중이거나 데이터가 아직 없는 경우, 혹은 이미 정보창이 있는 경우는 무시
    if (isInfoLoading || !detailedStore || infoOverlay) return;

    // API 응답(StoreData)을 BookmarkCard의 props(StoreInfo) 타입으로 변환
    const convertToCardData = (data: StoreData): StoreInfo => {
      const originalPlace = places.find((p) => p.placeId === data.placeId);
      return {
        id: String(data.placeId),
        name: data.name,
        address: data.address,
        hours: data.hours,
        category: data.category as CategoryType,
        // markerCode는 초기 places 데이터에서 가져옴 (getPlaceDetail 응답에 없으므로)
        storeClass: (originalPlace?.markerCode as StoreClassType) || 'LOCAL',
        event: data.eventTypeCode as EventType,
        status: data.status as StoreStatusType,
        isBookmarked: data.isBookmarked,
      };
    };

    const cardData = convertToCardData(detailedStore);

    const contentNode = document.createElement('div');
    const root = ReactDOM.createRoot(contentNode);
    root.render(
      <BookmarkCard
        store={cardData}
        variant="compact"
        onBookmarkToggle={() => onBookmarkToggle?.(detailedStore.placeId)}
      />
    );

    const positionOffset = 0.002;
    const newInfoOverlay = new window.kakao.maps.CustomOverlay({
      content: contentNode,
      position: new window.kakao.maps.LatLng(
        detailedStore.latitude,
        detailedStore.longitude + positionOffset
      ),
      xAnchor: 0,
      yAnchor: 1.1,
      zIndex: 150,
      clickable: true,
    });

    newInfoOverlay.setMap(map);
    setInfoOverlay(newInfoOverlay);

    const halfInfoWindowWidth = 0.0022;
    const newCenterLng = detailedStore.longitude + positionOffset + halfInfoWindowWidth;
    map.panTo(new window.kakao.maps.LatLng(detailedStore.latitude, newCenterLng));
  }, [detailedStore, isInfoLoading, map, selectedPlaceId, onBookmarkToggle, places, infoOverlay]);

  // 4. 마커 렌더링 (기존과 동일)
  useEffect(() => {
    if (!map) return;

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
        zIndex: isSelected ? 100 : 10,
      });

      customOverlay.setMap(map);
      markerOverlaysRef.current.push(customOverlay);
      markerRootsRef.current.push(root);
    });
  }, [map, places, selectedPlaceId, handleMarkerClick]);

  return <div ref={mapRef} className="w-full h-full absolute top-0 left-0 z-0" />;
};

export default MapContainer;
