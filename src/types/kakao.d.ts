// src/types/kakao.d.ts (수정된 코드)

export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
  getBounds(): KakaoMapBounds;
  getCenter(): KakaoLatLng;

  // --- [수정] 아래 두 줄을 추가하여 오류를 해결합니다. ---
  // [이유] KakaoMap 타입에 setDraggable과 setZoomable 메서드가 존재함을
  //       TypeScript에 알려주어, MapContainer.tsx에서의 타입 오류를 해결합니다.
  setDraggable(draggable: boolean): void;
  setZoomable(zoomable: boolean): void;
}

export interface KakaoMapBounds {
  getSouthWest(): KakaoLatLng;
  getNorthEast(): KakaoLatLng;
}

export interface KakaoMarker {
  setPosition(latlng: KakaoLatLng): void;
  setMap(map: KakaoMap | null): void;
  getPosition(): KakaoLatLng;
}

export interface KakaoCustomOverlay {
  setMap(map: KakaoMap | null): void;
  setPosition(position: KakaoLatLng): void;
}

export interface KakaoEvent {
  addListener(
    target: KakaoMap | KakaoMarker | KakaoCustomOverlay,
    type: string,
    handler: () => void
  ): void;
}

export interface KakaoCircle {
  setMap(map: KakaoMap | null): void;
  getBounds(): KakaoMapBounds;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Map: new (
          container: HTMLElement,
          options: { center: KakaoLatLng; level: number }
        ) => KakaoMap;
        Marker: new (options: { map: KakaoMap; position: KakaoLatLng }) => KakaoMarker;
        CustomOverlay: new (options: {
          position: KakaoLatLng;
          content: Node;
          yAnchor?: number;
          zIndex?: number;
        }) => KakaoCustomOverlay;
        Circle: new (options: {
          center: KakaoLatLng;
          radius: number;
          strokeWeight?: number;
          strokeColor?: string;
          strokeOpacity?: number;
          strokeStyle?:
            | 'solid'
            | 'shortdash'
            | 'shortdot'
            | 'shortdashdot'
            | 'longdash'
            | 'longdashdot';
          fillColor?: string;
          fillOpacity?: number;
        }) => KakaoCircle;
        event: KakaoEvent;
        load(callback: () => void): void;
      };
    };
  }
}
export {};
