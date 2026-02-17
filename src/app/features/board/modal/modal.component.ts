import {Component, input, signal} from '@angular/core';
import {LocalStorageModel} from '../../../shared/models/localStorage.model';
import {SearchFilterPipe} from './search-filter.pipe';

@Component({
  selector: 'app-modal',
  imports: [
    SearchFilterPipe
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  investments = input<LocalStorageModel[]>([]);
  searchTerm = signal('')
}
