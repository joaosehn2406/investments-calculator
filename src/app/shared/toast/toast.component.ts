import {Component, inject, signal} from '@angular/core';
import {ToastService} from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
  private toastService = inject(ToastService)

  message = signal<string>('')
  type = signal<'success' | 'error'>('success');

  constructor() {
    this.toastService.toast$.subscribe(toast => {
      this.message.set(toast.message);
      this.type.set(toast.type);

      setTimeout(() => {
        this.message.set('');
      }, 3000);
    });
  }
}
