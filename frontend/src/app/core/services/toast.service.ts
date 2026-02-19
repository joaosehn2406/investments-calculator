import {Injectable, signal} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ToastService {
  private toastSubject = new Subject<{ message: string, type: 'success' | 'error' }>();
  toast$ = this.toastSubject.asObservable();

  isVisible = signal<boolean>(false)

  show(message: string, type: 'success' | 'error' = 'success') {
    this.toastSubject.next({ message, type });
  }
}
