import {Component, effect, inject, input, output, signal, WritableSignal} from '@angular/core';
import {BoardModel, CURRENCIES, CurrencyType} from '../../shared/model/board.model';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {LocalStorageService} from '../../core/services/localStorage.service';
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
  comparableItems = output<WritableSignal<Set<string>>>();

  shouldCleanInputs = input<boolean>()
  isLoading = input<boolean>(false)

  showModal = signal(false);

  savedInvestments = signal<InvestmentSummary[]>([]);

  currencyTypes = Object.keys(CURRENCIES) as CurrencyType[]

  protected localStorageService = inject(LocalStorageService)

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
    this.investmentApiService.getAllInvestments().subscribe({
      next: (investments) => {
        this.savedInvestments.set(investments)
        this.showModal.set(true)
      } ,
      error: () => {
        this.toastService.show('Failed to load investments', 'error')
      }
    })
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onReceiveFromModal(selectedIds: WritableSignal<Set<string>>) {
    this.comparableItems.emit(selectedIds)
  }
}
