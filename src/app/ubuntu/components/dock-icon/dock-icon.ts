import { Component, input, output, signal, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WindowManagerService } from '../../services/window-manager.service';
import { AppId } from '../../models/window.model';

const ICONS: Record<AppId, string> = {
  about: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f47421"/><stop offset="100%" stop-color="#c9330a"/>
    </linearGradient></defs>
    <rect width="48" height="48" rx="11" fill="url(#a1)"/>
    <circle cx="24" cy="17" r="8" fill="rgba(255,255,255,0.95)"/>
    <path d="M6 42 Q7 29 24 29 Q41 29 42 42Z" fill="rgba(255,255,255,0.95)"/>
  </svg>`,

  projects: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="a2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4a90d9"/><stop offset="100%" stop-color="#1a5fa0"/>
    </linearGradient></defs>
    <rect width="48" height="48" rx="11" fill="url(#a2)"/>
    <path d="M24 6C33 6 41 13 41 21S24 43 24 43 7 29 7 21 15 6 24 6Z" fill="rgba(255,255,255,0.9)"/>
    <circle cx="24" cy="20" r="5.5" fill="#1a5fa0"/>
    <path d="M15 37L9 44L15 41Z M33 37L39 44L33 41Z" fill="rgba(255,255,255,0.65)"/>
  </svg>`,

  resume: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="a3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#26a64f"/><stop offset="100%" stop-color="#15702f"/>
    </linearGradient></defs>
    <rect width="48" height="48" rx="11" fill="url(#a3)"/>
    <rect x="11" y="7" width="26" height="34" rx="3" fill="rgba(255,255,255,0.95)"/>
    <rect x="15" y="14" width="18" height="2.5" rx="1.25" fill="#26a64f"/>
    <rect x="15" y="19" width="18" height="2" rx="1" fill="rgba(38,166,79,0.45)"/>
    <rect x="15" y="23" width="13" height="2" rx="1" fill="rgba(38,166,79,0.45)"/>
    <rect x="15" y="27" width="16" height="2" rx="1" fill="rgba(38,166,79,0.45)"/>
    <rect x="15" y="31" width="10" height="2" rx="1" fill="rgba(38,166,79,0.45)"/>
  </svg>`,

  contact: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="a4" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#b553c4"/><stop offset="100%" stop-color="#7a1a96"/>
    </linearGradient></defs>
    <rect width="48" height="48" rx="11" fill="url(#a4)"/>
    <rect x="7" y="13" width="34" height="23" rx="4" fill="rgba(255,255,255,0.95)"/>
    <path d="M7 15L24 27L41 15" fill="none" stroke="#b553c4" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,

  blog: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="a5" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff8c00"/><stop offset="100%" stop-color="#d45500"/>
    </linearGradient></defs>
    <rect width="48" height="48" rx="11" fill="url(#a5)"/>
    <rect x="9" y="9" width="30" height="30" rx="4" fill="rgba(255,255,255,0.95)"/>
    <rect x="14" y="16" width="20" height="2.5" rx="1.25" fill="#ff8c00"/>
    <rect x="14" y="21" width="20" height="2" rx="1" fill="rgba(255,140,0,0.45)"/>
    <rect x="14" y="25" width="14" height="2" rx="1" fill="rgba(255,140,0,0.45)"/>
    <rect x="14" y="29" width="17" height="2" rx="1" fill="rgba(255,140,0,0.45)"/>
  </svg>`,

  chrome: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="11" fill="#fff"/>
    <path d="M24 4 A20 20 0 0 1 44 24 L34 24 A10 10 0 0 0 24 14Z" fill="#fbbc04"/>
    <path d="M44 24 A20 20 0 0 1 14 41.3 L19 32.6 A10 10 0 0 0 34 24Z" fill="#34a853"/>
    <path d="M14 41.3 A20 20 0 0 1 4 24 L14 24 A10 10 0 0 0 19 32.6Z" fill="#4285f4"/>
    <circle cx="24" cy="24" r="11" fill="#ea4335"/>
    <circle cx="24" cy="24" r="7.5" fill="white"/>
  </svg>`,

  calculator: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="a6" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#78909c"/><stop offset="100%" stop-color="#263238"/>
    </linearGradient></defs>
    <rect width="48" height="48" rx="11" fill="url(#a6)"/>
    <rect x="10" y="10" width="28" height="28" rx="4" fill="rgba(255,255,255,0.1)"/>
    <rect x="12" y="12" width="24" height="8" rx="2" fill="rgba(255,255,255,0.88)"/>
    <rect x="12" y="23" width="7" height="5" rx="1.5" fill="rgba(255,255,255,0.7)"/>
    <rect x="21" y="23" width="7" height="5" rx="1.5" fill="rgba(255,255,255,0.7)"/>
    <rect x="30" y="23" width="7" height="5" rx="1.5" fill="#e95420"/>
    <rect x="12" y="31" width="7" height="5" rx="1.5" fill="rgba(255,255,255,0.7)"/>
    <rect x="21" y="31" width="7" height="5" rx="1.5" fill="rgba(255,255,255,0.7)"/>
    <rect x="30" y="31" width="7" height="5" rx="1.5" fill="rgba(255,255,255,0.7)"/>
  </svg>`,
};

@Component({
  selector: 'app-dock-icon',
  imports: [],
  templateUrl: './dock-icon.html',
  styleUrl: './dock-icon.scss'
})
export class DockIconComponent {
  appId   = input.required<AppId>();
  label   = input.required<string>();
  iconSrc = input.required<string>();
  open    = output<void>();

  hovered = signal(false);

  private sanitizer = inject(DomSanitizer);
  private wm = inject(WindowManagerService);

  svgIcon = computed((): SafeHtml =>
    this.sanitizer.bypassSecurityTrustHtml(ICONS[this.appId()] ?? ICONS.about)
  );

  hasWindow = computed(() => this.wm.openWindows().some(w => w.appId === this.appId()));
  isActive  = computed(() => {
    const wins = this.wm.openWindows();
    const w = wins.find(x => x.appId === this.appId());
    return !!w && !w.minimized && w.zIndex === this.wm.currentMaxZ;
  });
}
