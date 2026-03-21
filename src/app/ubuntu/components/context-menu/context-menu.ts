import { Component, input, output } from '@angular/core';

export interface ContextItem { label: string; icon?: string; action: string; divider?: boolean; }

@Component({
  selector: 'app-context-menu',
  imports: [],
  template: `
    <div class="ctx-menu ub-anim-scale-in" [style.left.px]="x()" [style.top.px]="y()"
         (click)="$event.stopPropagation()">
      @for (item of items(); track item.label) {
        @if (item.divider) {
          <div class="ctx-sep"></div>
        } @else {
          <button class="ctx-item" (click)="action.emit(item.action)">
            @if (item.icon) { <span class="ctx-icon">{{ item.icon }}</span> }
            {{ item.label }}
          </button>
        }
      }
    </div>
  `,
  styles: [`
    .ctx-menu {
      position: fixed; z-index: 99998;
      background: rgba(30,30,30,0.96);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 4px;
      min-width: 200px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      backdrop-filter: blur(12px);
    }
    .ctx-item {
      display: flex; align-items: center; gap: 10px;
      width: 100%; padding: 7px 12px;
      background: none; border: none; border-radius: 5px;
      color: rgba(255,255,255,0.9); font-family: var(--ub-font); font-size: 13px;
      cursor: pointer; text-align: left;
      &:hover { background: rgba(255,255,255,0.1); }
    }
    .ctx-icon { font-size: 14px; width: 18px; text-align: center; }
    .ctx-sep  { height: 1px; background: rgba(255,255,255,0.08); margin: 3px 0; }
  `]
})
export class ContextMenuComponent {
  x      = input<number>(0);
  y      = input<number>(0);
  items  = input<ContextItem[]>([]);
  action = output<string>();
}
