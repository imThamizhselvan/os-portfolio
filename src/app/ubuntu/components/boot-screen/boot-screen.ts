import { Component, OnInit, output } from '@angular/core';

@Component({
  selector: 'app-boot-screen',
  imports: [],
  template: `
    <div class="boot">
      <div class="boot-logo">
        <svg class="cof" viewBox="0 0 100 100" width="80" height="80">
          <circle cx="50" cy="50" r="46" fill="#e95420"/>
          <g fill="#fff">
            <circle cx="50" cy="16" r="9"/>
            <circle cx="17.7" cy="66" r="9"/>
            <circle cx="82.3" cy="66" r="9"/>
          </g>
          <g fill="none" stroke="#fff" stroke-width="4.5" opacity=".5">
            <line x1="50" y1="25" x2="25" y2="58"/>
            <line x1="50" y1="25" x2="75" y2="58"/>
            <line x1="25" y1="58" x2="75" y2="58"/>
          </g>
        </svg>
        <span class="boot-name">ubuntu</span>
      </div>
      <div class="boot-dots">
        <div class="dot d1"></div>
        <div class="dot d2"></div>
        <div class="dot d3"></div>
        <div class="dot d4"></div>
        <div class="dot d5"></div>
      </div>
    </div>
  `,
  styles: [`
    .boot {
      position: fixed; inset: 0;
      background: #300a24;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 32px;
      animation: ub-fade-in 0.4s ease forwards;
    }
    .boot-logo {
      display: flex; flex-direction: column; align-items: center; gap: 16px;
    }
    .cof { animation: ub-cof-spin 4s linear infinite; }
    .boot-name {
      color: #fff; font-size: 28px; font-weight: 300;
      letter-spacing: 6px; font-family: var(--ub-font);
    }
    .boot-dots {
      display: flex; gap: 10px; align-items: center;
    }
    .dot {
      width: 10px; height: 10px; border-radius: 50%;
      background: var(--ub-orange);
      animation: ub-boot-dot 1.4s ease-in-out infinite;
    }
    .d1{animation-delay:0s}   .d2{animation-delay:.16s}
    .d3{animation-delay:.32s} .d4{animation-delay:.48s}
    .d5{animation-delay:.64s}
  `]
})
export class BootScreenComponent implements OnInit {
  bootComplete = output<void>();

  ngOnInit(): void {
    setTimeout(() => this.bootComplete.emit(), 4000);
  }
}
