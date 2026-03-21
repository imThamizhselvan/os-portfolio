import { Component, output, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WindowManagerService } from '../../services/window-manager.service';
import { AppId, LAUNCHER_APPS } from '../../models/window.model';

const ICONS: Record<AppId, string> = {
  about: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="la0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f47421"/><stop offset="100%" stop-color="#c9330a"/></linearGradient></defs>
    <rect width="48" height="48" rx="12" fill="url(#la0)"/>
    <circle cx="24" cy="17" r="8" fill="rgba(255,255,255,0.9)"/>
    <path d="M6 44Q8 30 24 30Q40 30 42 44Z" fill="rgba(255,255,255,0.9)"/>
  </svg>`,
  projects: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="la1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4fc3f7"/><stop offset="100%" stop-color="#0277bd"/></linearGradient></defs>
    <rect width="48" height="48" rx="12" fill="url(#la1)"/>
    <path d="M24 8 L28 20 L40 20 L30 27 L34 40 L24 33 L14 40 L18 27 L8 20 L20 20Z" fill="rgba(255,255,255,0.9)"/>
  </svg>`,
  resume: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="la2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#a5d6a7"/><stop offset="100%" stop-color="#2e7d32"/></linearGradient></defs>
    <rect width="48" height="48" rx="12" fill="url(#la2)"/>
    <rect x="12" y="11" width="24" height="28" rx="3" fill="rgba(255,255,255,0.9)"/>
    <rect x="16" y="16" width="16" height="2" rx="1" fill="#2e7d32"/>
    <rect x="16" y="21" width="16" height="2" rx="1" fill="#2e7d32"/>
    <rect x="16" y="26" width="10" height="2" rx="1" fill="#2e7d32"/>
  </svg>`,
  contact: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="la3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ce93d8"/><stop offset="100%" stop-color="#6a1b9a"/></linearGradient></defs>
    <rect width="48" height="48" rx="12" fill="url(#la3)"/>
    <path d="M8 14 Q8 10 12 10 L36 10 Q40 10 40 14 L40 30 Q40 34 36 34 L28 34 L24 40 L20 34 L12 34 Q8 34 8 30Z" fill="rgba(255,255,255,0.9)"/>
    <circle cx="18" cy="22" r="2.5" fill="#6a1b9a"/><circle cx="24" cy="22" r="2.5" fill="#6a1b9a"/><circle cx="30" cy="22" r="2.5" fill="#6a1b9a"/>
  </svg>`,
  blog: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="la4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffcc02"/><stop offset="100%" stop-color="#e65100"/></linearGradient></defs>
    <rect width="48" height="48" rx="12" fill="url(#la4)"/>
    <rect x="10" y="10" width="28" height="28" rx="4" fill="rgba(255,255,255,0.9)"/>
    <rect x="14" y="15" width="20" height="3" rx="1.5" fill="#e65100"/>
    <rect x="14" y="21" width="20" height="2" rx="1" fill="#e65100" opacity="0.6"/>
    <rect x="14" y="26" width="14" height="2" rx="1" fill="#e65100" opacity="0.6"/>
  </svg>`,
  chrome: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#fff"/>
    <circle cx="24" cy="24" r="20" fill="white" stroke="#eee" stroke-width="1"/>
    <path d="M24 4 A20 20 0 0 1 44 24 L34 24 A10 10 0 0 0 24 14Z" fill="#fbbc04"/>
    <path d="M44 24 A20 20 0 0 1 14 41.3 L19 32.6 A10 10 0 0 0 34 24Z" fill="#34a853"/>
    <path d="M14 41.3 A20 20 0 0 1 4 24 L14 24 A10 10 0 0 0 19 32.6Z" fill="#4285f4"/>
    <circle cx="24" cy="24" r="11" fill="#ea4335"/>
    <circle cx="24" cy="24" r="8" fill="white"/>
  </svg>`,
  calculator: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="la6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#78909c"/><stop offset="100%" stop-color="#263238"/></linearGradient></defs>
    <rect width="48" height="48" rx="12" fill="url(#la6)"/>
    <rect x="10" y="10" width="28" height="28" rx="4" fill="rgba(255,255,255,0.1)"/>
    <rect x="12" y="12" width="24" height="8" rx="2" fill="rgba(255,255,255,0.85)"/>
    <rect x="12" y="23" width="6" height="5" rx="1.5" fill="rgba(255,255,255,0.7)"/>
    <rect x="21" y="23" width="6" height="5" rx="1.5" fill="rgba(255,255,255,0.7)"/>
    <rect x="30" y="23" width="6" height="5" rx="1.5" fill="#e95420"/>
    <rect x="12" y="31" width="6" height="5" rx="1.5" fill="rgba(255,255,255,0.7)"/>
    <rect x="21" y="31" width="6" height="5" rx="1.5" fill="rgba(255,255,255,0.7)"/>
    <rect x="30" y="31" width="6" height="5" rx="1.5" fill="rgba(255,255,255,0.7)"/>
  </svg>`,
};

@Component({
  selector: 'app-launcher',
  template: `
    <div class="launcher-overlay" (click)="close.emit()">
      <div class="launcher-panel" (click)="$event.stopPropagation()">
        <div class="la-header">
          <input class="la-search" placeholder="Type to search apps..."
                 (input)="onSearch($event)" autofocus />
        </div>
        <div class="la-grid">
          @for (app of filtered(); track app.appId) {
            <div class="la-item" (click)="launch(app.appId)">
              <div class="la-icon" [innerHTML]="icon(app.appId)"></div>
              <span class="la-label">{{ app.label }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .launcher-overlay {
      position: fixed; inset: 0; z-index: 9500;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(6px);
      display: flex; align-items: flex-end; justify-content: flex-start;
    }
    .launcher-panel {
      width: 480px; max-width: 95vw;
      background: rgba(22,22,22,0.97);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px 16px 0 0;
      padding: 20px;
      margin-left: 8px;
      animation: slide-up 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes slide-up {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    .la-header { margin-bottom: 18px; }
    .la-search {
      width: 100%; padding: 10px 16px; box-sizing: border-box;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 24px; color: #fff; font-size: 15px; outline: none;
      &:focus { border-color: #e95420; box-shadow: 0 0 0 2px rgba(233,84,32,0.25); }
      &::placeholder { color: rgba(255,255,255,0.4); }
    }
    .la-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
    }
    .la-item {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 14px 8px; border-radius: 12px; cursor: pointer;
      transition: background 0.15s;
      &:hover { background: rgba(255,255,255,0.08); }
      &:active { background: rgba(233,84,32,0.2); }
    }
    .la-icon { width: 52px; height: 52px; }
    .la-icon svg { width: 52px; height: 52px; display: block; }
    .la-label { font-size: 12px; color: rgba(255,255,255,0.85); text-align: center; line-height: 1.3; }
  `]
})
export class AppLauncherComponent {
  close = output<void>();

  private wm = inject(WindowManagerService);
  private sanitizer = inject(DomSanitizer);

  readonly apps = LAUNCHER_APPS;
  query = '';

  filtered() {
    const q = this.query.toLowerCase();
    return q ? this.apps.filter(a => a.label.toLowerCase().includes(q)) : this.apps;
  }

  icon(appId: AppId): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[appId] ?? ICONS.about);
  }

  onSearch(e: Event): void { this.query = (e.target as HTMLInputElement).value; }

  launch(appId: AppId): void {
    this.wm.open(appId);
    this.close.emit();
  }
}
