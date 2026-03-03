import {Component, effect, inject, input, output, signal} from '@angular/core';
import {BoardModel, CURRENCIES, CurrencyType} from '../../shared/model/board.model';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalComponent} from './modal/modal.component';
import {InvestmentApiService} from '../../core/services/invesment.api.service';
import {ToastService} from '../../core/services/toast.service';
import {InvestmentSummary} from '../../shared/model/InvestmentSummary';

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
  private investmentApiService = inject(InvestmentApiService)
  private toastService = inject(ToastService)

  calculate = output<BoardModel>();
  comparableItems = output<string[]>();
  visualizeItem = output<string>()
  modalLoading = output<boolean>()

  shouldCleanInputs = input<boolean>()
  isLoading = input<boolean>(false)

  showModal = signal(false);

  savedInvestments = signal<InvestmentSummary[]>([]);

  currencyTypes = Object.keys(CURRENCIES) as CurrencyType[]

  private fb = inject(FormBuilder);

  constructor() {
    effect(() => {
      if (this.shouldCleanInputs()) {
        this.form.reset({
          initialInvestment: null,
          financialContribution: null,
          expectedReturn: null,
          duration: null,
          period: 'year',
          currency: this.currencyTypes[0]
        });
      }
    });
  }

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
    this.calculate.emit(this.form.value as BoardModel);
  }

  openModal() {
    this.savedInvestments.set([]);
    this.showModal.set(true);
    this.modalLoading.emit(true);

    this.investmentApiService.getAllInvestments().subscribe({
      next: (investments) => {
        this.savedInvestments.set(investments)
        this.showModal.set(true)
        this.modalLoading.emit(false)
      } ,
      error: () => {
        this.toastService.show('Failed to load investments', 'error')
        this.modalLoading.emit(false)
      }
    })
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onCompareFromModal(selectedIds: string[]) {
    this.comparableItems.emit(selectedIds)
  }

  onVisualizeFromModal(id: string) {
    this.visualizeItem.emit(id)
  }
}
