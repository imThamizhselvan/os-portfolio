import { Injectable, computed, signal } from '@angular/core';
import { AppId, APP_CONFIG, WindowInstance } from '../models/window.model';

const MIN_W = 400;
const MIN_H = 280;

@Injectable({ providedIn: 'root' })
export class WindowManagerService {
  readonly openWindows = signal<WindowInstance[]>([]);
  readonly visibleWindows = computed(() => this.openWindows().filter((w) => !w.minimized));

  private zCounter = 100;
  private posOffset = 0;

  open(appId: AppId): void {
    const existing = this.openWindows().find((w) => w.appId === appId);
    if (existing) {
      this.restoreAndFocus(existing.id);
      return;
    }

    const cfg = APP_CONFIG[appId];
    const off = (this.posOffset % 6) * 36;
    this.posOffset++;

    const vw = window.innerWidth - 60; // sidebar
    const vh = window.innerHeight - 28; // top bar only
    const x = Math.max(60, Math.min(off + 80, 60 + vw - cfg.width));
    const y = Math.max(28, Math.min(off + 40, 28 + vh - cfg.height));

    this.openWindows.update((wins) => [
      ...wins,
      {
        id: `${appId}-${Date.now()}`,
        appId,
        title: cfg.title,
        iconSrc: cfg.iconSrc,
        x,
        y,
        width: cfg.width,
        height: cfg.height,
        zIndex: ++this.zCounter,
        minimized: false,
        maximized: false,
      },
    ]);
  }

  close(id: string): void {
    this.openWindows.update((w) => w.filter((x) => x.id !== id));
  }
  focus(id: string): void {
    this.openWindows.update((w) =>
      w.map((x) => (x.id === id ? { ...x, zIndex: ++this.zCounter } : x)),
    );
  }
  minimize(id: string): void {
    this.openWindows.update((w) => w.map((x) => (x.id === id ? { ...x, minimized: true } : x)));
  }

  maximize(id: string): void {
    this.openWindows.update((wins) =>
      wins.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized)
          return {
            ...w,
            maximized: false,
            x: w.prevX!,
            y: w.prevY!,
            width: w.prevWidth!,
            height: w.prevHeight!,
            zIndex: ++this.zCounter,
          };
        return {
          ...w,
          maximized: true,
          prevX: w.x,
          prevY: w.y,
          prevWidth: w.width,
          prevHeight: w.height,
          x: 60,
          y: 28,
          width: window.innerWidth - 60,
          height: window.innerHeight - 28,
          zIndex: ++this.zCounter,
        };
      }),
    );
  }

  restoreAndFocus(id: string): void {
    this.openWindows.update((w) =>
      w.map((x) => (x.id === id ? { ...x, minimized: false, zIndex: ++this.zCounter } : x)),
    );
  }

  updatePosition(id: string, x: number, y: number): void {
    this.openWindows.update((w) => w.map((x2) => (x2.id === id ? { ...x2, x, y } : x2)));
  }

  updateSize(id: string, width: number, height: number): void {
    this.openWindows.update((w) => w.map((x) => (x.id === id ? { ...x, width, height } : x)));
  }

  toggleWindow(id: string): void {
    const win = this.openWindows().find((w) => w.id === id);
    if (!win) return;
    if (win.minimized) this.restoreAndFocus(id);
    else if (win.zIndex === this.zCounter) this.minimize(id);
    else this.focus(id);
  }

  get currentMaxZ(): number {
    return this.zCounter;
  }
}
