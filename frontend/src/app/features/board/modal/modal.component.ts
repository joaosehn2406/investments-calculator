import {Component, inject, input, output, signal, WritableSignal} from '@angular/core';
import {LocalStorageModel} from '../../../shared/model/localStorage.model';
import {SearchFilterPipe} from './search-filter.pipe';
import {DatePipe} from '@angular/common';
import {ToastService} from '../../../core/services/toast.service';
import {InvestmentService} from '../../../core/services/investment.service';

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

  closeModal = output<void>();
  comparableItems = output<WritableSignal<Set<string>>>();

  searchTerm = signal('');
  selectedIds = signal<Set<string>>(new Set<string>());

  protected toastService = inject(ToastService);
  private investmentService = inject(InvestmentService);

  onCloseModal() {
    this.closeModal.emit();
  }

  onClickSelectItem(item: LocalStorageModel) {
    const current = this.selectedIds();

    if (current.has(item.id)) {
      current.delete(item.id);
    } else if (current.size < 2) {
      current.add(item.id);
    } else {
      this.toastService.show("Reached limit of 2 items!", 'error');
    }

    this.selectedIds.set(new Set<string>(current))
  }

  onClickCompare() {
    if (this.toastService.isVisible()) return

    if (this.investmentService.validateInvestmentType(this.selectedIds)) {
      this.toastService.show("These investments are comparable! ");
      this.comparableItems.emit(this.selectedIds);
      this.onCloseModal()
    } else {
      this.toastService.show("Please select 2 investments with the same type!", 'error');
    }
  }

  onClickVisualize() {
    this.comparableItems.emit(this.selectedIds);
    this.onCloseModal()
  }
}
