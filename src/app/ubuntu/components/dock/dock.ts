import { Component, inject, signal } from '@angular/core';
import { LAUNCHER_APPS } from '../../models/window.model';
import { WindowManagerService } from '../../services/window-manager.service';
import { DockIconComponent } from '../dock-icon/dock-icon';
import { AppLauncherComponent } from '../app-launcher/app-launcher';

@Component({
  selector: 'app-dock',
  imports: [DockIconComponent, AppLauncherComponent],
  host: { '(document:click)': 'onDocClick()' },
  template: `
    <div class="dock">
      @for (app of apps; track app.appId) {
        <app-dock-icon
          [appId]="app.appId"
          [label]="app.label"
          [iconSrc]="''"
          (open)="wm.open(app.appId)"
        />
      }
      <div class="dock-spacer"></div>
      <div class="dock-sep"></div>
      <div
        class="show-apps-btn"
        [class.active]="launcherOpen()"
        (click)="toggleLauncher($event)"
        title="Show Applications"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="rgba(255,255,255,0.75)">
          <circle cx="4" cy="4" r="2.5" />
          <circle cx="11" cy="4" r="2.5" />
          <circle cx="18" cy="4" r="2.5" />
          <circle cx="4" cy="11" r="2.5" />
          <circle cx="11" cy="11" r="2.5" />
          <circle cx="18" cy="11" r="2.5" />
          <circle cx="4" cy="18" r="2.5" />
          <circle cx="11" cy="18" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
        </svg>
      </div>
    </div>

    @if (launcherOpen()) {
      <app-launcher (close)="launcherOpen.set(false)" />
    }
  `,
  styles: [
    `
      .dock {
        position: fixed;
        left: 0;
        top: 28px;
        bottom: 0;
        width: 60px;
        background: rgba(20, 20, 20, 0.88);
        border-right: 1px solid rgba(255, 255, 255, 0.07);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0;
        gap: 4px;
        z-index: 9000;
        backdrop-filter: blur(16px);
      }
      .dock-spacer {
        flex: 1;
      }
      .dock-sep {
        width: 34px;
        height: 1px;
        background: rgba(255, 255, 255, 0.12);
        margin: 4px 0;
      }
      .show-apps-btn {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition:
          transform 0.15s,
          background 0.1s;
        &:hover,
        &.active {
          transform: scale(1.1);
          background: rgba(233, 84, 32, 0.25);
          border-color: rgba(233, 84, 32, 0.3);
        }
      }
    `,
  ],
})
export class DockComponent {
  readonly apps = LAUNCHER_APPS;
  wm = inject(WindowManagerService);
  launcherOpen = signal(false);

  toggleLauncher(e: Event): void {
    e.stopPropagation();
    this.launcherOpen.update((v) => !v);
  }

  onDocClick(): void {
    this.launcherOpen.set(false);
  }
}
