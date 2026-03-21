import { Component, signal } from '@angular/core';

const BOOKMARKS = [
  { label: 'GitHub', url: 'https://github.com/tronictio', icon: '🐙' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/thamil', icon: '🔗' },
  { label: 'Portfolio', url: 'https://imthamil.com', icon: '🌐' },
  { label: 'Google', url: 'https://google.com', icon: '🔍' },
];

@Component({
  selector: 'app-chrome-app',
  template: `
    <div class="browser">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="nav-btns">
          <button class="nav-btn" (click)="goBack()" title="Back">&#8592;</button>
          <button class="nav-btn" (click)="goForward()" title="Forward">&#8594;</button>
          <button class="nav-btn" (click)="reload()" title="Reload">&#8635;</button>
        </div>
        <div class="addr-bar">
          <span class="lock-icon">🔒</span>
          <input class="addr-input" [value]="addressBar()"
                 (keydown.enter)="navigate($event)"
                 (focus)="onFocus($event)"
                 placeholder="Search or enter address" />
        </div>
        <button class="nav-btn menu-btn" title="Menu">⋮</button>
      </div>

      <!-- Bookmarks bar -->
      <div class="bookmarks-bar">
        @for (bm of bookmarks; track bm.url) {
          <button class="bm-btn" (click)="loadUrl(bm.url)">
            {{ bm.icon }} {{ bm.label }}
          </button>
        }
      </div>

      <!-- Content -->
      @if (currentUrl()) {
        <iframe class="browser-frame"
                [src]="currentUrl()"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                referrerpolicy="no-referrer">
        </iframe>
      } @else {
        <div class="new-tab">
          <div class="nt-logo">
            <svg viewBox="0 0 48 48" width="64" height="64">
              <circle cx="24" cy="24" r="24" fill="#e95420"/>
              <circle cx="24" cy="24" r="10" fill="white" opacity="0.9"/>
              <path d="M24 4 A20 20 0 0 1 44 24 L34 24 A10 10 0 0 0 24 14Z" fill="#fbbc04"/>
              <path d="M44 24 A20 20 0 0 1 14 41.3 L19 32.6 A10 10 0 0 0 34 24Z" fill="#34a853"/>
              <path d="M14 41.3 A20 20 0 0 1 4 24 L14 24 A10 10 0 0 0 19 32.6Z" fill="#4285f4"/>
            </svg>
          </div>
          <input class="nt-search" placeholder="Search the web..."
                 (keydown.enter)="searchWeb($event)" />
          <div class="nt-shortcuts">
            @for (bm of bookmarks; track bm.url) {
              <div class="shortcut" (click)="loadUrl(bm.url)">
                <div class="sc-icon">{{ bm.icon }}</div>
                <div class="sc-label">{{ bm.label }}</div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .browser {
      display: flex; flex-direction: column; height: 100%;
      background: #202124; color: #fff;
      font-family: 'Ubuntu', 'Segoe UI', sans-serif;
    }
    .toolbar {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 10px; background: #2d2e30;
      border-bottom: 1px solid #3c4043;
      flex-shrink: 0;
    }
    .nav-btns { display: flex; gap: 2px; }
    .nav-btn {
      width: 28px; height: 28px; border: none; border-radius: 50%;
      background: transparent; color: #9aa0a6; font-size: 16px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      &:hover { background: rgba(255,255,255,0.1); color: #fff; }
    }
    .menu-btn { font-size: 20px; }
    .addr-bar {
      flex: 1; display: flex; align-items: center; gap: 6px;
      background: #3c4043; border-radius: 20px; padding: 4px 12px;
    }
    .lock-icon { font-size: 12px; color: #9aa0a6; }
    .addr-input {
      flex: 1; background: transparent; border: none; outline: none;
      color: #fff; font-size: 14px;
      &::placeholder { color: #9aa0a6; }
    }
    .bookmarks-bar {
      display: flex; gap: 4px; padding: 4px 10px;
      background: #2d2e30; border-bottom: 1px solid #3c4043;
      flex-shrink: 0; overflow-x: auto;
    }
    .bm-btn {
      background: transparent; border: none; color: #e8eaed;
      font-size: 12px; cursor: pointer; padding: 4px 8px;
      border-radius: 4px; white-space: nowrap;
      &:hover { background: rgba(255,255,255,0.1); }
    }
    .browser-frame {
      flex: 1; border: none; background: #fff;
    }
    .new-tab {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; padding-top: 80px; background: #202124;
    }
    .nt-logo { margin-bottom: 24px; }
    .nt-search {
      width: 500px; max-width: 90%; padding: 12px 20px;
      background: #303134; border: 1px solid #5f6368;
      border-radius: 24px; color: #fff; font-size: 16px; outline: none;
      &:focus { border-color: #8ab4f8; box-shadow: 0 0 0 2px rgba(138,180,248,0.3); }
      &::placeholder { color: #9aa0a6; }
    }
    .nt-shortcuts {
      display: flex; gap: 16px; margin-top: 32px; flex-wrap: wrap; justify-content: center;
    }
    .shortcut {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      cursor: pointer; padding: 12px; border-radius: 8px;
      &:hover { background: rgba(255,255,255,0.07); }
    }
    .sc-icon { width: 48px; height: 48px; border-radius: 50%; background: #303134; display: flex; align-items: center; justify-content: center; font-size: 22px; }
    .sc-label { font-size: 12px; color: #9aa0a6; }
  `]
})
export class ChromeAppComponent {
  readonly bookmarks = BOOKMARKS;
  addressBar = signal('');
  currentUrl = signal('');

  loadUrl(url: string): void {
    this.addressBar.set(url);
    this.currentUrl.set(url);
  }

  navigate(e: Event): void {
    const val = (e.target as HTMLInputElement).value.trim();
    if (!val) return;
    const url = val.startsWith('http') ? val : `https://www.google.com/search?q=${encodeURIComponent(val)}`;
    this.loadUrl(url);
  }

  searchWeb(e: Event): void {
    const val = (e.target as HTMLInputElement).value.trim();
    if (!val) return;
    this.loadUrl(`https://www.google.com/search?q=${encodeURIComponent(val)}`);
  }

  onFocus(e: Event): void { (e.target as HTMLInputElement).select(); }
  goBack():    void { /* iframe history not accessible cross-origin */ }
  goForward(): void { }
  reload():    void { const u = this.currentUrl(); this.currentUrl.set(''); setTimeout(() => this.currentUrl.set(u), 50); }
}
