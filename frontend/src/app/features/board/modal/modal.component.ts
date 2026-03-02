import {Component, inject, input, output, signal, WritableSignal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ToastService} from '../../../core/services/toast.service';
import {InvestmentService} from '../../../core/services/investment.service';
import {InvestmentSummary} from '../../../shared/model/InvestmentSummary';
import {InvestmentApiService} from '../../../core/services/invesment.api.service';

@Component({
  selector: 'app-modal',
  imports: [
    DatePipe
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  investments = input<InvestmentSummary[]>([]);

  closeModal = output<void>();
  comparableItems = output<WritableSignal<Set<string>>>();

  searchTerm = signal('');
  selectedIds = signal<Set<string>>(new Set<string>());
  searchResults = signal<InvestmentSummary[] | null>(null);
  searchLoading = signal(false);

  protected toastService = inject(ToastService);
  private investmentService = inject(InvestmentService);
  private investmentApiService = inject(InvestmentApiService);

  private searchTimeout: any = null;

  onSearch(term: string) {
    this.searchTerm.set(term);

    clearTimeout(this.searchTimeout);

    if (term.trim() === '') {
      this.searchResults.set(null);
      this.searchLoading.set(false);
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.searchLoading.set(true);

      this.investmentApiService.getAllInvestments(term).subscribe({
        next: (results) => {
          this.searchResults.set(results);
          this.searchLoading.set(false);
        },
        error: () => {
          this.toastService.show('Search failed', 'error');
          this.searchLoading.set(false);
        }
      });
    }, 400);
  }

  getDisplayedInvestments(): InvestmentSummary[] {
    return this.searchResults() ?? this.investments();
  }

  onCloseModal() {
    this.closeModal.emit();
  }

  onClickSelectItem(item: InvestmentSummary) {
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
    if (this.toastService.isVisible()) return;

    if (this.investmentService.validateInvestmentType(this.selectedIds)) {
      this.toastService.show("These investments are comparable! ");
      this.comparableItems.emit(this.selectedIds);
      this.onCloseModal();
    } else {
      this.toastService.show("Please select 2 investments with the same type!", 'error');
    }
  }

  onClickVisualize() {
    this.comparableItems.emit(this.selectedIds);
    this.onCloseModal();
  }
}
