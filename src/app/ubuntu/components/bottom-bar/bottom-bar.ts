import { Component, inject, signal, computed } from '@angular/core';
import { WindowManagerService } from '../../services/window-manager.service';
import { SoundService } from '../../services/sound.service';
import { AppLauncherComponent } from '../app-launcher/app-launcher';
import { PowerMenuComponent } from '../power-menu/power-menu';
import { AppId } from '../../models/window.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const TASK_ICONS: Record<AppId, string> = {
  about: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ti0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f47421"/><stop offset="100%" stop-color="#c9330a"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#ti0)"/><circle cx="16" cy="11" r="5" fill="rgba(255,255,255,0.9)"/><path d="M4 29Q5 20 16 20Q27 20 28 29Z" fill="rgba(255,255,255,0.9)"/></svg>`,
  projects: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ti1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4fc3f7"/><stop offset="100%" stop-color="#0277bd"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#ti1)"/><path d="M16 4 L19 13 L28 13 L21 18 L23 27 L16 22 L9 27 L11 18 L4 13 L13 13Z" fill="rgba(255,255,255,0.9)"/></svg>`,
  resume: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ti2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a5d6a7"/><stop offset="100%" stop-color="#2e7d32"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#ti2)"/><rect x="8" y="7" width="16" height="18" rx="2" fill="rgba(255,255,255,0.9)"/><rect x="10" y="10" width="12" height="2" rx="1" fill="#2e7d32"/><rect x="10" y="14" width="12" height="1.5" rx="0.75" fill="#2e7d32" opacity="0.6"/><rect x="10" y="17" width="8" height="1.5" rx="0.75" fill="#2e7d32" opacity="0.6"/></svg>`,
  contact: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ti3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ce93d8"/><stop offset="100%" stop-color="#6a1b9a"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#ti3)"/><path d="M4 8 Q4 6 6 6 L26 6 Q28 6 28 8 L28 20 Q28 22 26 22 L20 22 L16 27 L12 22 L6 22 Q4 22 4 20Z" fill="rgba(255,255,255,0.9)"/><circle cx="12" cy="14" r="2" fill="#6a1b9a"/><circle cx="16" cy="14" r="2" fill="#6a1b9a"/><circle cx="20" cy="14" r="2" fill="#6a1b9a"/></svg>`,
  blog: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ti4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffcc02"/><stop offset="100%" stop-color="#e65100"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#ti4)"/><rect x="6" y="6" width="20" height="20" rx="3" fill="rgba(255,255,255,0.9)"/><rect x="9" y="10" width="14" height="2" rx="1" fill="#e65100"/><rect x="9" y="14" width="14" height="1.5" rx="0.75" fill="#e65100" opacity="0.6"/><rect x="9" y="18" width="10" height="1.5" rx="0.75" fill="#e65100" opacity="0.6"/></svg>`,
  chrome: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="8" fill="#fff"/><circle cx="16" cy="16" r="14" fill="white" stroke="#eee" stroke-width="0.5"/><path d="M16 2 A14 14 0 0 1 30 16 L22 16 A6 6 0 0 0 16 10Z" fill="#fbbc04"/><path d="M30 16 A14 14 0 0 1 10 26.1 L14 19.3 A6 6 0 0 0 22 16Z" fill="#34a853"/><path d="M10 26.1 A14 14 0 0 1 2 16 L10 16 A6 6 0 0 0 14 19.3Z" fill="#4285f4"/><circle cx="16" cy="16" r="8" fill="#ea4335"/><circle cx="16" cy="16" r="5.5" fill="white"/></svg>`,
  calculator: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ti6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#78909c"/><stop offset="100%" stop-color="#263238"/></linearGradient></defs><rect width="32" height="32" rx="8" fill="url(#ti6)"/><rect x="7" y="7" width="18" height="18" rx="3" fill="rgba(255,255,255,0.1)"/><rect x="8" y="8" width="16" height="5" rx="1.5" fill="rgba(255,255,255,0.85)"/><rect x="8" y="15" width="4" height="3" rx="1" fill="rgba(255,255,255,0.7)"/><rect x="14" y="15" width="4" height="3" rx="1" fill="rgba(255,255,255,0.7)"/><rect x="20" y="15" width="4" height="3" rx="1" fill="#e95420"/><rect x="8" y="20" width="4" height="3" rx="1" fill="rgba(255,255,255,0.7)"/><rect x="14" y="20" width="4" height="3" rx="1" fill="rgba(255,255,255,0.7)"/><rect x="20" y="20" width="4" height="3" rx="1" fill="rgba(255,255,255,0.7)"/></svg>`,
};

@Component({
  selector: 'app-bottom-bar',
  imports: [AppLauncherComponent, PowerMenuComponent],
  host: { '(document:click)': 'onDocClick()' },
  template: `
    <div class="bottom-bar">
      <!-- Launcher button -->
      <button class="launcher-btn"
              [class.active]="launcherOpen()"
              (click)="toggleLauncher($event)"
              title="Show Applications">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
          <circle cx="4"  cy="4"  r="2.2"/>
          <circle cx="12" cy="4"  r="2.2"/>
          <circle cx="20" cy="4"  r="2.2"/>
          <circle cx="4"  cy="12" r="2.2"/>
          <circle cx="12" cy="12" r="2.2"/>
          <circle cx="20" cy="12" r="2.2"/>
          <circle cx="4"  cy="20" r="2.2"/>
          <circle cx="12" cy="20" r="2.2"/>
          <circle cx="20" cy="20" r="2.2"/>
        </svg>
      </button>

      <div class="bar-sep"></div>

      <!-- Task buttons: open windows -->
      <div class="task-area">
        @for (w of wm.openWindows(); track w.id) {
          <button class="task-btn"
                  [class.active]="!w.minimized && w.zIndex === wm.currentMaxZ"
                  [class.minimized]="w.minimized"
                  (click)="wm.toggleWindow(w.id)"
                  [title]="w.title">
            <div class="task-icon" [innerHTML]="taskIcon(w.appId)"></div>
            <span class="task-label">{{ w.title }}</span>
            <div class="task-dot" [class.open]="!w.minimized"></div>
          </button>
        }
      </div>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- System tray -->
      <div class="tray">
        <button class="tray-btn" (click)="sound.toggle()" [title]="sound.enabled() ? 'Mute' : 'Unmute'">
          {{ sound.enabled() ? '🔊' : '🔇' }}
        </button>
        <span class="tray-clock">{{ time() }}</span>

        <div class="power-wrap">
          <button class="tray-btn" (click)="togglePower($event)" title="System">⏻</button>
          @if (powerOpen()) {
            <app-power-menu [openUp]="true" (close)="powerOpen.set(false)" />
          }
        </div>
      </div>
    </div>

    @if (launcherOpen()) {
      <app-launcher (close)="launcherOpen.set(false)" />
    }
  `,
  styles: [`
    :host { position: fixed; bottom: 0; left: 0; right: 0; z-index: 9000; }

    .bottom-bar {
      height: 48px;
      background: rgba(18,18,18,0.96);
      border-top: 1px solid rgba(255,255,255,0.07);
      backdrop-filter: blur(20px);
      display: flex; align-items: center;
      padding: 0 8px; gap: 4px;
    }

    .launcher-btn {
      width: 44px; height: 38px; border-radius: 8px; border: none;
      background: transparent; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
      &:hover, &.active { background: rgba(233,84,32,0.25); }
    }

    .bar-sep {
      width: 1px; height: 28px;
      background: rgba(255,255,255,0.1); flex-shrink: 0; margin: 0 4px;
    }

    .task-area {
      display: flex; gap: 4px; overflow-x: auto; flex: 1;
      scrollbar-width: none;
      &::-webkit-scrollbar { display: none; }
    }

    .task-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 0 10px; height: 36px; min-width: 100px; max-width: 180px;
      border-radius: 6px; border: 1px solid transparent;
      background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8);
      font-size: 12px; cursor: pointer; white-space: nowrap; overflow: hidden;
      font-family: 'Ubuntu', 'Segoe UI', sans-serif;
      transition: background 0.15s;
      position: relative;

      &:hover { background: rgba(255,255,255,0.1); }
      &.active { background: rgba(233,84,32,0.2); border-color: rgba(233,84,32,0.4); color: #fff; }
      &.minimized { opacity: 0.55; }
    }

    .task-icon { width: 20px; height: 20px; flex-shrink: 0; }
    .task-icon svg { width: 20px; height: 20px; display: block; }

    .task-label { flex: 1; overflow: hidden; text-overflow: ellipsis; text-align: left; }

    .task-dot {
      width: 4px; height: 4px; border-radius: 50%;
      background: rgba(255,255,255,0.2); flex-shrink: 0;
      &.open { background: #e95420; }
    }

    .flex-1 { flex: 1; }

    .tray {
      display: flex; align-items: center; gap: 4px; flex-shrink: 0;
    }

    .tray-btn {
      width: 34px; height: 34px; border-radius: 6px; border: none;
      background: transparent; color: rgba(255,255,255,0.75); font-size: 16px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      &:hover { background: rgba(255,255,255,0.1); color: #fff; }
    }

    .tray-clock {
      font-size: 13px; color: rgba(255,255,255,0.85);
      font-family: 'Ubuntu', 'Segoe UI', sans-serif;
      padding: 0 8px; white-space: nowrap;
    }

    .power-wrap { position: relative; }
  `]
})
export class BottomBarComponent {
  wm    = inject(WindowManagerService);
  sound = inject(SoundService);
  private sanitizer = inject(DomSanitizer);

  launcherOpen = signal(false);
  powerOpen    = signal(false);
  time         = signal('');
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 1000);
  }

  private updateTime(): void {
    const n = new Date();
    this.time.set(`${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}`);
  }

  taskIcon(appId: AppId): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(TASK_ICONS[appId] ?? TASK_ICONS.about);
  }

  toggleLauncher(e: Event): void { e.stopPropagation(); this.launcherOpen.update(v => !v); }
  togglePower(e: Event): void    { e.stopPropagation(); this.powerOpen.update(v => !v); }

  onDocClick(): void {
    this.launcherOpen.set(false);
    this.powerOpen.set(false);
  }
}
