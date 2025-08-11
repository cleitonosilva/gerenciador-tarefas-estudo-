import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="toast-container">
      @for (toast of toastService.getToasts()(); track toast.id) {
        <app-toast [toast]="toast" (close)="toastService.remove($event)" />
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9999;
      pointer-events: none;
    }
    
    .toast-container app-toast {
      pointer-events: auto;
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
