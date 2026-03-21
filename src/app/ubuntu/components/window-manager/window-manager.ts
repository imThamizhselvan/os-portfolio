import { Component, inject, computed } from '@angular/core';
import { WindowManagerService } from '../../services/window-manager.service';
import { UbuntuWindowComponent } from '../ubuntu-window/ubuntu-window';

@Component({
  selector: 'app-window-manager',
  imports: [UbuntuWindowComponent],
  template: `
    @for (win of windows(); track win.id) {
      @if (!win.minimized) {
        <app-ubuntu-window [win]="win" [focused]="win.zIndex === maxZ()" />
      }
    }
  `,
  styles: [':host { position: absolute; inset: 0; pointer-events: none; z-index: 10; } app-ubuntu-window { pointer-events: all; }']
})
export class WindowManagerComponent {
  private wm = inject(WindowManagerService);
  readonly windows = this.wm.openWindows;
  readonly maxZ = computed(() => this.wm.currentMaxZ);
}
