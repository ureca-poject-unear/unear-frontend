// src/types/kakao.d.ts

declare global {
  interface KakaoLatLng {
    getLat(): number;
    getLng(): number;
  }

  interface KakaoMap {
    setCenter(latlng: KakaoLatLng): void;
    setLevel(level: number): void;
  }

  interface KakaoMapOptions {
    center: KakaoLatLng;
    level: number;
  }

  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
        load(callback: () => void): void;
        MapTypeId: unknown;
        ZoomControl: new () => unknown;
        services?: unknown;
      };
    };
  }
}

export {};
