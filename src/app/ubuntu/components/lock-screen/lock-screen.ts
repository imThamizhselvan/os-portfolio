import { Component, OnInit, OnDestroy, output, signal } from '@angular/core';

@Component({
  selector: 'app-lock-screen',
  imports: [],
  templateUrl: './lock-screen.html',
  styleUrl: './lock-screen.scss'
})
export class LockScreenComponent implements OnInit, OnDestroy {
  unlockComplete = output<void>();

  timeStr  = signal('00:00');
  dateStr  = signal('');
  fadingOut = signal(false);

  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.updateClock();
    this.timer = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private updateClock(): void {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    this.timeStr.set(`${h}:${m}`);
    this.dateStr.set(now.toLocaleDateString('en-AU', {
      weekday: 'long', day: 'numeric', month: 'long'
    }));
  }

  unlock(): void {
    if (this.fadingOut()) return;
    this.fadingOut.set(true);
    setTimeout(() => this.unlockComplete.emit(), 500);
  }
}
