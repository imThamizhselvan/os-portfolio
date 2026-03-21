import { Component, output, input, inject } from '@angular/core';
import { DesktopService } from '../../services/desktop.service';
import { SoundService } from '../../services/sound.service';

@Component({
  selector: 'app-power-menu',
  imports: [],
  template: `
    <div class="power-menu" [class.open-up]="openUp()" (click)="$event.stopPropagation()">
      <button class="pm-item" (click)="lock()">
        <span class="pm-icon">🔒</span> Lock
      </button>
      <button class="pm-item" (click)="logout()">
        <span class="pm-icon">🚪</span> Log Out
      </button>
      <div class="pm-sep"></div>
      <button class="pm-item pm-danger" (click)="restart()">
        <span class="pm-icon">↺</span> Restart
      </button>
      <button class="pm-item pm-danger" (click)="toggleFullscreen()">
        <span class="pm-icon">⛶</span> Fullscreen
      </button>
    </div>
  `,
  styles: [`
    .power-menu {
      position: absolute; top: calc(100% + 4px); right: 0;
      &.open-up { top: auto; bottom: calc(100% + 4px); }
      background: rgba(30,30,30,0.96);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      padding: 4px;
      min-width: 160px;
      z-index: 99999;
      backdrop-filter: blur(12px);
    }
    .pm-item {
      display: flex; align-items: center; gap: 8px;
      width: 100%; padding: 7px 12px;
      background: none; border: none; border-radius: 5px;
      color: rgba(255,255,255,0.9); font-family: var(--ub-font); font-size: 13px;
      cursor: pointer; text-align: left;
      &:hover { background: rgba(255,255,255,0.1); }
      &.pm-danger { color: #ff8a80; }
    }
    .pm-icon { font-size: 14px; width: 18px; }
    .pm-sep { height: 1px; background: rgba(255,255,255,0.08); margin: 3px 0; }
  `]
})
export class PowerMenuComponent {
  close    = output<void>();
  openUp   = input<boolean>(false);
  private desktop = inject(DesktopService);
  private sound   = inject(SoundService);

  lock(): void { this.close.emit(); this.sound.play('logout'); setTimeout(() => this.desktop.lock(), 200); }
  logout(): void { this.close.emit(); setTimeout(() => this.desktop.lock(), 200); }
  restart(): void { this.close.emit(); setTimeout(() => this.desktop.restart(), 200); }
  toggleFullscreen(): void {
    this.close.emit();
    !document.fullscreenElement
      ? document.documentElement.requestFullscreen().catch(() => {})
      : document.exitFullscreen().catch(() => {});
  }
}
