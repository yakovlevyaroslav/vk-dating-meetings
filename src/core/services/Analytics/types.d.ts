export {};

declare global {
  interface Window {
    ym(id: string, event: string, name: string): void;
    _tmr: {
      push(event: { id: string; type: string; goal?: string; start?: number }): void;
    };
  }
}
