import {Component, input, output, signal} from '@angular/core';
import {LocalStorageModel} from '../../../shared/models/localStorage.model';
import {SearchFilterPipe} from './search-filter.pipe';
import {DatePipe} from '@angular/common';

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

  onCloseModal() {
    this.closeModal.emit()
  }
}
