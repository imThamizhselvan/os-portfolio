import { Component, inject } from '@angular/core';
import { LAUNCHER_APPS } from '../../models/window.model';
import { WindowManagerService } from '../../services/window-manager.service';
import { DockIconComponent } from '../dock-icon/dock-icon';

@Component({
  selector: 'app-dock',
  imports: [DockIconComponent],
  template: `
    <div class="dock">
      @for (app of apps; track app.appId) {
        <app-dock-icon
          [appId]="app.appId"
          [label]="app.label"
          [iconSrc]="''"
          (open)="wm.open(app.appId)" />
      }
      <div class="dock-sep"></div>
      <div class="show-apps-btn" (click)="openShowApps()" title="Show Applications">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="rgba(255,255,255,0.75)">
          <circle cx="4"  cy="4"  r="2.5"/>
          <circle cx="11" cy="4"  r="2.5"/>
          <circle cx="18" cy="4"  r="2.5"/>
          <circle cx="4"  cy="11" r="2.5"/>
          <circle cx="11" cy="11" r="2.5"/>
          <circle cx="18" cy="11" r="2.5"/>
          <circle cx="4"  cy="18" r="2.5"/>
          <circle cx="11" cy="18" r="2.5"/>
          <circle cx="18" cy="18" r="2.5"/>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    .dock {
      position: fixed; left: 0; top: 28px; bottom: 0;
      width: 60px;
      background: rgba(20,20,20,0.88);
      border-right: 1px solid rgba(255,255,255,0.07);
      display: flex; flex-direction: column;
      align-items: center;
      padding: 10px 0;
      gap: 4px;
      z-index: 9000;
      backdrop-filter: blur(16px);
    }
    .dock-sep {
      width: 34px; height: 1px;
      background: rgba(255,255,255,0.12);
      margin: 4px 0;
    }
    .show-apps-btn {
      width: 44px; height: 44px; border-radius: 12px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: transform 0.15s, background 0.1s;
      &:hover {
        transform: scale(1.1) translateY(-2px);
        background: rgba(255,255,255,0.15);
      }
    }
  `]
})
export class DockComponent {
  readonly apps = LAUNCHER_APPS;
  wm = inject(WindowManagerService);

  openShowApps(): void {
    for (const app of this.apps) {
      if (!this.wm.openWindows().find(w => w.appId === app.appId)) {
        this.wm.open(app.appId);
        break;
      }
    }
  }
}
