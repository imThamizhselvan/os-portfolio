import { Component, input, inject, NgZone, signal, computed, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { WindowInstance } from '../../models/window.model';
import { WindowManagerService } from '../../services/window-manager.service';
import { WindowTitlebarComponent } from '../window-titlebar/window-titlebar';
import { AboutAppComponent } from '../../apps/about-app/about-app';
import { ProjectsAppComponent } from '../../apps/projects-app/projects-app';
import { ResumeAppComponent } from '../../apps/resume-app/resume-app';
import { ContactAppComponent } from '../../apps/contact-app/contact-app';
import { BlogAppComponent } from '../../apps/blog-app/blog-app';
import { ChromeAppComponent } from '../../apps/chrome-app/chrome-app';
import { CalculatorAppComponent } from '../../apps/calculator-app/calculator-app';

const APP_MAP: Record<string, Type<any>> = {
  about: AboutAppComponent, projects: ProjectsAppComponent,
  resume: ResumeAppComponent, contact: ContactAppComponent, blog: BlogAppComponent,
  chrome: ChromeAppComponent, calculator: CalculatorAppComponent,
};

@Component({
  selector: 'app-ubuntu-window',
  imports: [NgComponentOutlet, WindowTitlebarComponent],
  templateUrl: './ubuntu-window.html',
  styleUrl: './ubuntu-window.scss'
})
export class UbuntuWindowComponent {
  win     = input.required<WindowInstance>();
  focused = input<boolean>(false);

  private wm   = inject(WindowManagerService);
  private zone = inject(NgZone);

  dragging = signal(false);
  resizing = signal(false);

  appComponent = computed(() => APP_MAP[this.win().appId]);

  get style() {
    const w = this.win();
    return { left: w.x+'px', top: w.y+'px', width: w.width+'px', height: w.height+'px', zIndex: w.zIndex };
  }

  onFocus(): void { this.wm.focus(this.win().id); }
  onMinimize(): void { this.wm.minimize(this.win().id); }
  onMaximize(): void { this.wm.maximize(this.win().id); }
  onClose(): void    { this.wm.close(this.win().id); }

  onDragStart(e: MouseEvent): void {
    const w = this.win();
    if (w.maximized) return;
    e.preventDefault();
    this.wm.focus(w.id);
    const sx = e.clientX - w.x, sy = e.clientY - w.y;
    this.dragging.set(true);

    const move = (ev: MouseEvent) => {
      const vw = window.innerWidth, vh = window.innerHeight - 48;
      this.wm.updatePosition(w.id,
        Math.max(0, Math.min(ev.clientX - sx, vw - w.width)),
        Math.max(28, Math.min(ev.clientY - sy, vh - 40))
      );
    };
    const up = () => {
      this.dragging.set(false);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    this.zone.runOutsideAngular(() => {
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
  }

  onResizeStart(e: MouseEvent): void {
    const w = this.win();
    if (w.maximized) return;
    e.preventDefault(); e.stopPropagation();
    this.wm.focus(w.id);
    const sx = e.clientX, sy = e.clientY, sw = w.width, sh = w.height;
    this.resizing.set(true);

    const move = (ev: MouseEvent) => {
      this.wm.updateSize(w.id,
        Math.max(400, sw + (ev.clientX - sx)),
        Math.max(280, sh + (ev.clientY - sy))
      );
    };
    const up = () => {
      this.resizing.set(false);
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    this.zone.runOutsideAngular(() => {
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
  }
}
