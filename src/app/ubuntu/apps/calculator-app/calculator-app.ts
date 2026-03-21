import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-calculator-app',
  template: `
    <div class="calc">
      <div class="calc-display">
        <div class="calc-expr">{{ expr() || '&nbsp;' }}</div>
        <div class="calc-val">{{ display() }}</div>
      </div>
      <div class="calc-grid">
        @for (btn of buttons; track btn.label) {
          <button
            class="calc-btn"
            [class.op]="btn.type === 'op'"
            [class.eq]="btn.type === 'eq'"
            [class.fn]="btn.type === 'fn'"
            [class.zero]="btn.label === '0'"
            (click)="press(btn)">
            {{ btn.label }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .calc {
      display: flex; flex-direction: column;
      height: 100%; background: #2d2d2d; color: #fff;
      font-family: 'Ubuntu', 'Segoe UI', sans-serif;
      user-select: none;
    }
    .calc-display {
      padding: 16px 20px 12px;
      background: #1e1e1e;
      border-bottom: 1px solid #444;
      text-align: right;
      flex-shrink: 0;
    }
    .calc-expr {
      font-size: 13px; color: #888; min-height: 18px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .calc-val {
      font-size: 38px; font-weight: 300; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .calc-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px; background: #1a1a1a;
      flex: 1;
    }
    .calc-btn {
      background: #3a3a3a; border: none; color: #fff;
      font-size: 20px; font-weight: 300; cursor: pointer;
      transition: background 0.1s;
      &:hover { background: #4a4a4a; }
      &:active { background: #555; }
    }
    .calc-btn.op  { background: #5a5a5a; font-size: 22px; }
    .calc-btn.op:hover { background: #6a6a6a; }
    .calc-btn.eq  { background: #e95420; }
    .calc-btn.eq:hover { background: #f46535; }
    .calc-btn.fn  { background: #2d2d2d; color: #aaa; font-size: 16px; }
    .calc-btn.fn:hover { background: #383838; }
    .calc-btn.zero { grid-column: span 2; }
  `]
})
export class CalculatorAppComponent {
  display = signal('0');
  expr    = signal('');

  private current  = '';
  private operand  = '';
  private operator = '';
  private newNum   = true;

  readonly buttons = [
    { label: 'AC',  type: 'fn'  }, { label: '+/-', type: 'fn' }, { label: '%',  type: 'fn' }, { label: '÷',  type: 'op' },
    { label: '7',   type: 'num' }, { label: '8',   type: 'num'}, { label: '9',  type: 'num'}, { label: '×',  type: 'op' },
    { label: '4',   type: 'num' }, { label: '5',   type: 'num'}, { label: '6',  type: 'num'}, { label: '−',  type: 'op' },
    { label: '1',   type: 'num' }, { label: '2',   type: 'num'}, { label: '3',  type: 'num'}, { label: '+',  type: 'op' },
    { label: '0',   type: 'num' },                                { label: '.',  type: 'num'}, { label: '=',  type: 'eq' },
  ];

  press(btn: { label: string; type: string }): void {
    const { label, type } = btn;

    if (type === 'num') {
      if (label === '.' && this.current.includes('.')) return;
      if (this.newNum) { this.current = label === '.' ? '0.' : label; this.newNum = false; }
      else { this.current = this.current === '0' && label !== '.' ? label : this.current + label; }
      this.display.set(this.current);

    } else if (type === 'op') {
      if (this.operator && !this.newNum) this.calculate();
      this.operand  = this.current || this.display();
      this.operator = label;
      this.newNum   = true;
      this.expr.set(`${this.operand} ${label}`);

    } else if (type === 'eq') {
      if (!this.operator) return;
      this.expr.set(`${this.operand} ${this.operator} ${this.current} =`);
      this.calculate();
      this.operator = '';

    } else if (type === 'fn') {
      if (label === 'AC')  { this.current = '0'; this.operand = ''; this.operator = ''; this.newNum = true; this.display.set('0'); this.expr.set(''); }
      if (label === '+/-') { const n = -parseFloat(this.display()); this.current = String(n); this.display.set(this.current); }
      if (label === '%')   { const n = parseFloat(this.display()) / 100; this.current = String(n); this.display.set(this.current); }
    }
  }

  private calculate(): void {
    const a = parseFloat(this.operand), b = parseFloat(this.current);
    let result = 0;
    if (this.operator === '+')  result = a + b;
    if (this.operator === '−')  result = a - b;
    if (this.operator === '×')  result = a * b;
    if (this.operator === '÷')  result = b !== 0 ? a / b : 0;
    const str = Number.isInteger(result) ? String(result) : result.toPrecision(10).replace(/\.?0+$/, '');
    this.current = str;
    this.display.set(str);
    this.newNum = true;
  }
}
