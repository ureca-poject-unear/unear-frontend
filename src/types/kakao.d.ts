// src/types/kakao.d.ts
export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
}

export interface KakaoMapOptions {
  center: KakaoLatLng;
  level: number;
}

export interface KakaoMarker {
  setPosition: (latlng: kakao.maps.LatLng) => void;
  setMap: (map: kakao.maps.Map | null) => void;
  getPosition: () => kakao.maps.LatLng;
}

export interface KakaoCustomOverlay {
  setMap(map: KakaoMap | null): void;
  setPosition(position: KakaoLatLng): void;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
        Marker: new (options: { map: KakaoMap; position: KakaoLatLng }) => KakaoMarker;
        load(callback: () => void): void;
        MapTypeId: unknown;
        ZoomControl: new () => unknown;
        services?: unknown;
        CustomOverlay: new (options: {
          position: KakaoLatLng;
          content: Node;
          yAnchor?: number;
          zIndex?: number;
        }) => KakaoCustomOverlay;
      };
    };
  }
}

export {};
