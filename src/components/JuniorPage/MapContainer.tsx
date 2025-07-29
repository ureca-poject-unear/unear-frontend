import { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import type { KakaoMap, KakaoCustomOverlay } from '@/types/kakao';
import type { Place } from '@/apis/getPlaces';
import { getPlaces } from '@/apis/getPlaces';
import { getPlaceDetail } from '@/apis/getPlaceDetail';
import type { StoreData } from '@/types/storeDetail';
import MapMarkerIcon from '@/components/common/MapMarkerIcon';
import BookmarkCard from '@/components/JuniorPage/BookmarkCard';
import type { StoreInfo } from '@/components/JuniorPage/BookmarkCard';
import type {
  CategoryType,
  EventType,
  StoreClassType,
  StoreStatusType,
} from '@/components/common/StoreTypeIcon';

interface MapContainerProps {
  onMarkerSelect?: (place: Place) => void;
  onBookmarkToggle?: (placeId: number) => void;
}

const MapContainer = ({ onMarkerSelect, onBookmarkToggle }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  const [map, setMap] = useState<KakaoMap | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  const [infoOverlay, setInfoOverlay] = useState<KakaoCustomOverlay | null>(null);
  const [detailedStore, setDetailedStore] = useState<StoreData | null>(null);
  const [isInfoLoading, setIsInfoLoading] = useState(false);

  const markerOverlaysRef = useRef<KakaoCustomOverlay[]>([]);
  const markerRootsRef = useRef<any[]>([]);

  const closeInfoWindow = useCallback(() => {
    infoOverlay?.setMap(null);
    setInfoOverlay(null);
    setSelectedPlaceId(null);
    setDetailedStore(null);
  }, [infoOverlay]);

  const handleMarkerClick = useCallback(
    async (place: Place) => {
      if (selectedPlaceId === place.placeId) {
        closeInfoWindow();
        return;
      }

      closeInfoWindow();
      setSelectedPlaceId(place.placeId);
      setIsInfoLoading(true);

      if (!map) return;

      try {
        const center = map.getCenter();
        const fetchedDetails = await getPlaceDetail(
          place.placeId,
          String(center.getLat()),
          String(center.getLng())
        );
        setDetailedStore(fetchedDetails);
      } catch (error) {
        console.error('장소 상세 정보 조회 실패:', error);
        closeInfoWindow();
      } finally {
        setIsInfoLoading(false);
      }

      onMarkerSelect?.(place);
    },
    [map, selectedPlaceId, closeInfoWindow, onMarkerSelect]
  );

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

  useEffect(() => {
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

  useEffect(() => {
    if (!map) return;
    const idleListener = window.kakao.maps.event.addListener(map, 'idle', fetchPlacesInViewport);
    const clickListener = window.kakao.maps.event.addListener(map, 'click', closeInfoWindow);

    fetchPlacesInViewport();

    return () => {
      window.kakao.maps.event.removeListener(map, 'idle', idleListener);
      window.kakao.maps.event.removeListener(map, 'click', clickListener);
    };
  }, [map, fetchPlacesInViewport, closeInfoWindow]);

  useEffect(() => {
    if (!map || !selectedPlaceId) return;
    if (isInfoLoading || !detailedStore || infoOverlay) return;

    const originalPlace = places.find((p) => p.placeId === detailedStore.placeId);
    const cardData: StoreInfo = {
      id: String(detailedStore.placeId),
      name: detailedStore.name,
      address: detailedStore.address,
      hours: detailedStore.hours,
      category: detailedStore.category as CategoryType,
      storeClass: (originalPlace?.markerCode as StoreClassType) || 'LOCAL',
      event: detailedStore.eventTypeCode as EventType,
      status: detailedStore.status as StoreStatusType,
      isBookmarked: detailedStore.isBookmarked,
    };

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

  useEffect(() => {
    if (!map) return;

    markerOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    markerRootsRef.current.forEach((root) => {
      // React 18 대응: unmount는 렌더링 이후 비동기 처리
      setTimeout(() => root.unmount(), 0);
    });

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
