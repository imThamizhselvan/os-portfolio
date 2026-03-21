import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-app',
  imports: [FormsModule],
  templateUrl: './contact-app.html',
  styleUrl: './contact-app.scss'
})
export class ContactAppComponent {
  name    = signal('');
  email   = signal('');
  message = signal('');
  status  = signal<'idle'|'sending'|'sent'|'error'>('idle');

  async submit(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.name() || !this.email() || !this.message()) return;
    this.status.set('sending');
    try {
      const r = await fetch('https://formspree.io/f/mqapolpv', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: this.name(), email: this.email(), message: this.message() }),
      });
      if (r.ok) { this.status.set('sent'); this.name.set(''); this.email.set(''); this.message.set(''); }
      else this.status.set('error');
    } catch { this.status.set('error'); }
  }
}
