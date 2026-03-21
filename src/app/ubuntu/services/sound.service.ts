import { Injectable, signal } from '@angular/core';

export type SoundName = 'login' | 'logout' | 'notification' | 'close';

@Injectable({ providedIn: 'root' })
export class SoundService {
  readonly enabled = signal(true);

  play(sound: SoundName): void {
    if (!this.enabled()) return;
    try {
      const a = new Audio(`assets/ubuntu/sounds/${sound}.mp3`);
      a.volume = 0.4;
      a.play().catch(() => {});
    } catch {}
  }

  toggle(): void { this.enabled.update(v => !v); }
}
