import {Component, inject, output, signal, WritableSignal} from '@angular/core';
import {BoardModel, CURRENCIES, CurrencyType} from '../../shared/model/board.model';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {LocalStorageService} from '../../core/services/localStorage.service';
import {LocalStorageModel} from '../../shared/model/localStorage.model';
import {ModalComponent} from './modal/modal.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ModalComponent
  ]
})
export class BoardComponent {
  calculate = output<BoardModel>();
  comparableItems = output<WritableSignal<Set<string>>>();

  showModal = signal(false);

  savedInvestments = signal<LocalStorageModel[]>([]);

  currencyTypes = Object.keys(CURRENCIES) as CurrencyType[]

  protected localStorageService = inject(LocalStorageService)

  private fb = inject(FormBuilder);

  form = this.fb.group({
    initialInvestment: [null as number | null, [
      Validators.required,
      Validators.min(1)
    ]],
    financialContribution: [null as number | null, [
      Validators.required,
      Validators.min(0)
    ]],
    expectedReturn: [null as number | null, [
      Validators.required,
      Validators.min(0.1),
      Validators.max(200)
    ]],
    duration: [null as number | null, [
      Validators.required,
      Validators.min(1),
      Validators.max(80)
    ]],
    period: ['year', Validators.required],
    currency: [this.currencyTypes[0], Validators.required]
  });

  onCalculate() {
    if (this.form.invalid) return;

    this.calculate.emit(this.form.value as BoardModel);
  }

  openModal() {
    this.savedInvestments.set(this.localStorageService.list());
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onReceiveFromModal(selectedIds: WritableSignal<Set<string>>) {
    this.comparableItems.emit(selectedIds)
  }
}
