import {Component, inject, input, output, signal} from '@angular/core';
import {LocalStorageModel} from '../../../shared/model/localStorage.model';
import {SearchFilterPipe} from './search-filter.pipe';
import {DatePipe} from '@angular/common';
import {ToastService} from '../../../core/services/toast.service';

@Component({
  selector: 'app-modal',
  imports: [
    SearchFilterPipe,
    DatePipe
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  investments = input<LocalStorageModel[]>([]);

  closeModal = output<void>()

  searchTerm = signal('')
  selectedIds = signal<Set<string>>(new Set<string>())

  private toastService = inject(ToastService);

  onCloseModal() {
    this.closeModal.emit()
  }

  onClickSelectItem(item: LocalStorageModel) {
    const current = this.selectedIds();

    if(current.has(item.id)) {
      current.delete(item.id);
    } else if (current.size < 2) {
      current.add(item.id);
    } else {
      this.toastService.show("Reached limit of 2 items!", 'error');
    }

    this.selectedIds.set(new Set<string>(current))
  }

  validateInvestmentType() {

  }
}
