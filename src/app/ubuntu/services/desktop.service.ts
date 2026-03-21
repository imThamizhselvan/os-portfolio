import { Injectable, signal } from '@angular/core';

export type DesktopPhase = 'boot' | 'lock' | 'desktop';

@Injectable({ providedIn: 'root' })
export class DesktopService {
  readonly phase = signal<DesktopPhase>('boot');

  advanceToLock(): void   { this.phase.set('lock'); }
  advanceToDesktop(): void { this.phase.set('desktop'); }
  lock(): void             { this.phase.set('lock'); }
  restart(): void          { this.phase.set('boot'); }
}
