import { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import type { StoreType } from '@/types/Junior';
import MapMarkerIcon from '@/components/common/MapMarkerIcon';
import BookmarkCard from '@/components/JuniorPage/BookmarkCard';

interface MapContainerProps {
  stores: StoreType[];
  onBookmarkToggle: (storeId: string) => void;
}

const MapContainer = ({ stores, onBookmarkToggle }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const overlaysRef = useRef<any[]>([]);
  const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  const [map, setMap] = useState<any>(null);
  const [infoOverlay, setInfoOverlay] = useState<any>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const closeInfoWindow = useCallback(() => {
    if (infoOverlay) {
      infoOverlay.setMap(null);
    }
    setInfoOverlay(null);
    setSelectedMarkerId(null);
  }, [infoOverlay]);

  const handleMarkerClick = (markerId: string) => {
    if (selectedMarkerId === markerId) {
      closeInfoWindow();
      return;
    }

    if (infoOverlay) infoOverlay.setMap(null);

    const markerInfo = stores.find((m) => m.id === markerId);
    if (!markerInfo || !map) return;

    const contentNode = document.createElement('div');
    const root = ReactDOM.createRoot(contentNode);
    root.render(
      <BookmarkCard
        store={markerInfo}
        variant="compact"
        onBookmarkToggle={() => onBookmarkToggle(markerInfo.id)}
      />
    );

    const positionOffset = 0.002;

    const newInfoOverlay = new window.kakao.maps.CustomOverlay({
      content: contentNode,
      position: new window.kakao.maps.LatLng(markerInfo.lat, markerInfo.lng + positionOffset),
      xAnchor: 0,
      yAnchor: 1.1,
      zIndex: 50,
      clickable: true,
    });

    newInfoOverlay.setMap(map);
    setInfoOverlay(newInfoOverlay);
    setSelectedMarkerId(markerId);

    const halfInfoWindowWidth = 0.0022;
    const newCenterLng = markerInfo.lng + positionOffset + halfInfoWindowWidth;
    const newCenter = new window.kakao.maps.LatLng(markerInfo.lat, newCenterLng);
    map.panTo(newCenter);
  };

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

        // ✅ 원의 경계 정보를 가져와 지도 범위를 재설정하여 원이 완전히 보이도록 합니다.
        const bounds = circle.getBounds();
        mapInstance.setBounds(bounds, 0, 0, 0, 0);
      });
    };
  }, [kakaoMapKey, map]);

  useEffect(() => {
    if (!map) return;
    const handleMapClickHandler = () => closeInfoWindow();
    const listener = window.kakao.maps.event.addListener(map, 'click', handleMapClickHandler);
    return () => window.kakao.maps.event.removeListener(map, 'click', listener);
  }, [map, closeInfoWindow]);

  useEffect(() => {
    if (infoOverlay && selectedMarkerId) {
      const markerInfo = stores.find((m) => m.id === selectedMarkerId);
      if (markerInfo) {
        const contentNode = document.createElement('div');
        const root = ReactDOM.createRoot(contentNode);
        root.render(
          <BookmarkCard
            store={markerInfo}
            variant="compact"
            onBookmarkToggle={() => onBookmarkToggle(markerInfo.id)}
          />
        );
        infoOverlay.setContent(contentNode);
      }
    }
  }, [stores, infoOverlay, selectedMarkerId, onBookmarkToggle]);

  useEffect(() => {
    if (!map) return;
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    stores.forEach((markerInfo) => {
      const contentNode = document.createElement('div');
      const root = ReactDOM.createRoot(contentNode);
      const isSelected = selectedMarkerId === markerInfo.id;
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
        zIndex: isSelected ? 100 : 1,
      });
      customOverlay.setMap(map);
      overlaysRef.current.push(customOverlay);
    });

    return () => overlaysRef.current.forEach((overlay) => overlay.setMap(null));
  }, [map, stores, selectedMarkerId]);

  return <div ref={mapRef} className="w-full h-full absolute top-0 left-0 z-0" />;
};

export default MapContainer;
