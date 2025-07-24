import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import type { CategoryType, StoreClassType, EventType } from '@/components/common/MapMarkerIcon';
import MapMarkerIcon from '@/components/common/MapMarkerIcon';

// --- 1. 타입 및 데이터 정의 ---

// 지도에 표시할 마커 데이터의 타입을 정의합니다.
interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  category: CategoryType;
  storeClass: StoreClassType;
  event: EventType;
}

// 지도에 표시할 마커 데이터 예시입니다. (실제로는 API로 받아옵니다)
const initialMarkers: MarkerData[] = [
  {
    id: 'marker1',
    lat: 37.545581,
    lng: 127.056961,
    category: 'CAFE',
    storeClass: 'LOCAL',
    event: 'GENERAL',
  },
  {
    id: 'marker2',
    lat: 37.543581,
    lng: 127.054961,
    category: 'FOOD',
    storeClass: 'LOCAL',
    event: 'GENERAL',
  },
  {
    id: 'marker3',
    lat: 37.546081,
    lng: 127.053961,
    category: 'SHOPPING',
    storeClass: 'LOCAL',
    event: 'GENERAL',
  },
  {
    id: 'marker4',
    lat: 37.544,
    lng: 127.0585,
    category: 'BEAUTY',
    storeClass: 'LOCAL',
    event: 'REQUIRE',
  },
  {
    id: 'marker5',
    lat: 37.542581,
    lng: 127.057561,
    category: 'POPUP',
    storeClass: 'LOCAL',
    event: 'GENERAL',
  },
];

const MapContainer = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  // --- 2. 상태 관리 ---
  const [markersData] = useState(initialMarkers);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  // 마커를 클릭했을 때 호출될 함수
  const handleMarkerClick = (markerId: string) => {
    // 같은 마커를 다시 클릭하면 선택 해제, 다른 마커를 클릭하면 선택 변경
    setSelectedMarkerId((prevSelectedId) => (prevSelectedId === markerId ? null : markerId));
  };

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
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        if (!container) return;

        const options = {
          center: new window.kakao.maps.LatLng(37.544581, 127.055961),
          level: 4,
        };

        const map = new window.kakao.maps.Map(container, options);

        // --- 기존 원(Circle) 생성 코드 (유지) ---
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
        // --- 원 생성 코드 끝 ---

        // --- 3. MapMarkerIcon을 커스텀 오버레이로 지도에 추가 ---
        markersData.forEach((markerInfo) => {
          const contentNode = document.createElement('div');

          // React 컴포넌트를 렌더링할 Root를 생성합니다.
          const root = ReactDOM.createRoot(contentNode);

          // isSelected 값은 현재 선택된 마커 ID와 비교하여 결정합니다.
          const isSelected = selectedMarkerId === markerInfo.id;

          // MapMarkerIcon 컴포넌트를 렌더링합니다.
          root.render(
            <MapMarkerIcon
              category={markerInfo.category}
              storeClass={markerInfo.storeClass}
              event={markerInfo.event}
              isSelected={isSelected}
              onClick={() => handleMarkerClick(markerInfo.id)}
            />
          );

          // 렌더링된 DOM 노드를 content로 사용하여 커스텀 오버레이를 생성합니다. [3]
          const customOverlay = new window.kakao.maps.CustomOverlay({
            position: new window.kakao.maps.LatLng(markerInfo.lat, markerInfo.lng),
            content: contentNode, // React 컴포넌트가 렌더링된 DOM 엘리먼트
            yAnchor: 1, // 마커의 하단이 좌표에 맞도록 설정
          });

          // 지도에 커스텀 오버레이를 추가합니다.
          customOverlay.setMap(map);
        });
      });
    };

    return () => {
      // 컴포넌트가 언마운트될 때 스크립트를 제거합니다.
      const scripts = document.head.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('dapi.kakao.com')) {
          document.head.removeChild(scripts[i]);
        }
      }
    };
    // selectedMarkerId가 바뀔 때마다 useEffect를 다시 실행하여 마커의 선택/비선택 스타일을 업데이트합니다.
  }, [kakaoMapKey, markersData, selectedMarkerId]);

  return <div ref={mapRef} className="w-full h-full absolute top-0 left-0 z-0" />;
};

export default MapContainer;
