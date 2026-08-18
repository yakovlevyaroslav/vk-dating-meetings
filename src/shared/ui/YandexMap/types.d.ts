export {};

declare global {
  interface Window {
    ymaps3?: {
      ready: Promise<void>;
      YMap: new (container: HTMLElement, props: { location: { center: [number, number]; zoom: number } }) => {
        addChild: (child: unknown) => void;
        destroy: () => void;
        setLocation: (location: { center?: [number, number]; zoom?: number; duration?: number }) => void;
      };
      YMapDefaultSchemeLayer: new (props?: Record<string, unknown>) => unknown;
      YMapDefaultFeaturesLayer: new (props?: Record<string, unknown>) => unknown;
      YMapMarker: new (props: { coordinates: [number, number] }, content?: HTMLElement) => unknown;
    };
  }
}
