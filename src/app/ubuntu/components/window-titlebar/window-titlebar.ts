import { Component, input, output } from '@angular/core';
import { WindowInstance } from '../../models/window.model';

@Component({
  selector: 'app-window-titlebar',
  imports: [],
  templateUrl: './window-titlebar.html',
  styleUrl: './window-titlebar.scss'
})
export class WindowTitlebarComponent {
  win      = input.required<WindowInstance>();
  focused  = input<boolean>(false);
  minimize = output<void>();
  maximize = output<void>();
  close    = output<void>();
  dragStart = output<MouseEvent>();
}
