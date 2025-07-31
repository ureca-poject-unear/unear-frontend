// src/types/kakao.d.ts

export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
  getBounds(): KakaoMapBounds;
  getCenter(): KakaoLatLng;
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
