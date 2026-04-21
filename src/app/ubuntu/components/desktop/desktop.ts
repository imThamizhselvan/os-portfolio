import { Component, signal, HostListener } from '@angular/core';
import { TopBarComponent } from '../top-bar/top-bar';
import { DockComponent } from '../dock/dock';
import { WindowManagerComponent } from '../window-manager/window-manager';
import { ContextMenuComponent, ContextItem } from '../context-menu/context-menu';

interface Background {
  type: 'image' | 'gradient';
  value: string;
  label: string;
}

const BACKGROUNDS: Background[] = [
  { type: 'image', value: 'assets/ubuntu/wallpapers/wall-1.webp', label: 'Jammy Jellyfish' },
  { type: 'image', value: 'assets/ubuntu/wallpapers/wall-2.webp', label: 'Dark Stone' },
  { type: 'image', value: 'assets/ubuntu/wallpapers/wall-3.webp', label: 'Ubuntu Abstract' },
  { type: 'image', value: 'assets/ubuntu/wallpapers/wall-4.webp', label: 'Ubuntu Forest' },
  {
    type: 'gradient',
    value:
      'linear-gradient(135deg,#300a24 0%,#4a1042 15%,#5d0e41 30%,#c0392b 55%,#e95420 75%,#f4a95a 100%)',
    label: 'Ubuntu Gradient',
  },
  {
    type: 'gradient',
    value: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
    label: 'Midnight Blue',
  },
];

@Component({
  selector: 'app-desktop',
  imports: [TopBarComponent, DockComponent, WindowManagerComponent, ContextMenuComponent],
  templateUrl: './desktop.html',
  styleUrl: './desktop.scss',
})
export class DesktopComponent {
  ctxVisible = signal(false);
  ctxX = signal(0);
  ctxY = signal(0);

  readonly backgrounds = BACKGROUNDS;
  bgIndex = signal(0);

  get currentBg(): Background {
    return this.backgrounds[this.bgIndex()];
  }
  get bgStyle(): string {
    const b = this.currentBg;
    return b.type === 'image' ? `url('${b.value}') center/cover no-repeat` : b.value;
  }

  get ctxItems(): ContextItem[] {
    return [
      { label: 'Change Background', icon: '🖼️', action: 'bg' },
      { divider: true, label: '', action: '' },
      ...this.backgrounds.map((b, i) => ({
        label: `  ${i === this.bgIndex() ? '✓ ' : '   '}${b.label}`,
        icon: b.type === 'image' ? '🖼' : '🎨',
        action: `bg-${i}`,
      })),
      { divider: true, label: '', action: '' },
      { label: 'Display Settings', icon: '🖥️', action: 'display' },
      { label: 'Open Terminal', icon: '⬛', action: 'terminal' },
      { label: 'About This Portfolio', icon: 'ℹ️', action: 'about' },
    ];
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(e: MouseEvent): void {
    e.preventDefault();
    this.ctxX.set(e.clientX);
    this.ctxY.set(e.clientY);
    this.ctxVisible.set(true);
  }

  @HostListener('click')
  onDesktopClick(): void {
    this.ctxVisible.set(false);
  }

  onContextAction(action: string): void {
    this.ctxVisible.set(false);
    if (action === 'bg') {
      this.bgIndex.update((i) => (i + 1) % this.backgrounds.length);
    } else if (action.startsWith('bg-')) {
      this.bgIndex.set(Number(action.split('-')[1]));
    }
  }
}
