import {Component, inject, input, output, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ToastService} from '../../../core/services/toast.service';
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
  comparableItems = output<string[]>();
  visualizeItem = output<string>()

  searchTerm = signal('');
  selectedIds = signal<string[]>([]);
  searchResults = signal<InvestmentSummary[] | null>(null);
  searchLoading = signal(false);

  protected toastService = inject(ToastService);
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

    if (current.includes(item.id)) {
      this.selectedIds.set(current.filter(id => id !== item.id))
    } else if (current.length < 2) {
      this.selectedIds.set([...current, item.id]);
    } else {
      this.toastService.show("Reached limit of 2 items!", 'error');
    }
  }

  onClickCompare() {
    if (this.toastService.isVisible()) return;
    this.comparableItems.emit(this.selectedIds())
    this.onCloseModal();
  }

  onClickVisualize() {
    this.visualizeItem.emit(<string>this.selectedIds().at(0))
    this.onCloseModal();
  }
}
