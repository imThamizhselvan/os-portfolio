import { Component, inject } from '@angular/core';
import { DesktopService } from './ubuntu/services/desktop.service';
import { BootScreenComponent } from './ubuntu/components/boot-screen/boot-screen';
import { LockScreenComponent } from './ubuntu/components/lock-screen/lock-screen';
import { DesktopComponent } from './ubuntu/components/desktop/desktop';

@Component({
  selector: 'app-root',
  imports: [BootScreenComponent, LockScreenComponent, DesktopComponent],
  template: `
    @switch (desktop.phase()) {
      @case ('boot') {
        <app-boot-screen (bootComplete)="desktop.advanceToLock()" />
      }
      @case ('lock') {
        <app-lock-screen (unlockComplete)="desktop.advanceToDesktop()" />
      }
      @case ('desktop') {
        <app-desktop />
      }
    }
  `,
  styles: [':host { display: block; width: 100%; height: 100%; }']
})
export class App {
  desktop = inject(DesktopService);
}
