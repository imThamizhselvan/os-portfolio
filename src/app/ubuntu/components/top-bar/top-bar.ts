import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { WindowManagerService } from '../../services/window-manager.service';
import { SoundService } from '../../services/sound.service';
import { PowerMenuComponent } from '../power-menu/power-menu';

@Component({
  selector: 'app-top-bar',
  imports: [PowerMenuComponent],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
  host: { '(document:click)': 'closePowerMenu()' }
})
export class TopBarComponent implements OnInit, OnDestroy {
  private wm    = inject(WindowManagerService);
  sound         = inject(SoundService);

  timeStr   = signal('');
  dateStr   = signal('');
  powerOpen = signal(false);

  activeTitle = computed(() => {
    const wins = this.wm.openWindows();
    const maxZ = this.wm.currentMaxZ;
    const top = wins.find(w => w.zIndex === maxZ && !w.minimized);
    return top?.title ?? '';
  });

  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.updateClock();
    this.timer = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy(): void { if (this.timer) clearInterval(this.timer); }

  private updateClock(): void {
    const now = new Date();
    const h = now.getHours().toString().padStart(2,'0');
    const m = now.getMinutes().toString().padStart(2,'0');
    this.timeStr.set(`${h}:${m}`);
    this.dateStr.set(now.toLocaleDateString('en-AU', { weekday:'short', day:'numeric', month:'short' }));
  }

  togglePowerMenu(e: Event): void {
    e.stopPropagation();
    this.powerOpen.update(v => !v);
  }

  closePowerMenu(): void { this.powerOpen.set(false); }
}
