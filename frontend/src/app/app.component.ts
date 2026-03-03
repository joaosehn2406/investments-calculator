import {Component, inject, signal, WritableSignal} from '@angular/core';
import {BoardModel, CurrencyType, PeriodType} from './shared/model/board.model';
import {InvestmentModel} from './shared/model/investment.model';
import {HeaderComponent} from './features/header/header.component';
import {BoardComponent} from './features/board/board.component';
import {InvestmentTableComponent} from './features/investment-table/investment.table.component';
import {FooterComponent} from './features/footer/footer.component';
import {ToastComponent} from './shared/toast/toast.component';
import {LocalStorageService} from './core/services/localStorage.service';
import {LocalStorageModel} from './shared/model/localStorage.model';
import {finalize} from 'rxjs';
import {ToastService} from './core/services/toast.service';
import {InvestmentApiService} from './core/services/invesment.api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    HeaderComponent,
    BoardComponent,
    FooterComponent,
    InvestmentTableComponent,
    ToastComponent
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  private investmentApiService = inject(InvestmentApiService)
  private localStorageService = inject(LocalStorageService)
  private toastService = inject(ToastService)

  result = signal<InvestmentModel[]>([]);
  selectedPeriod = signal<PeriodType>('year')
  selectedCurrency = signal<CurrencyType>('USD')
  selectedForComparison = signal<LocalStorageModel[]>([]);
  shouldCleanInputs = signal<boolean>(false)
  isLoading = signal<boolean>(false)

  onCalculate(data: BoardModel) {
    this.isLoading.set(true)

    this.investmentApiService.calculate(data)
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.result.set(response.results);
          this.selectedPeriod.set(data.period);
          this.selectedCurrency.set(data.currency);
          this.selectedForComparison.set([]);
          this.shouldCleanInputs.set(false);
        },
        error: (err) => {
          const message = err?.error?.errors
            ? Object.values(err.error.errors).flat().join(', ')
            : 'Calculation failed';

          this.toastService.show(message, 'error')
        }
      });
  }

  onDeleteAllData() {
    this.result.set([])
    this.selectedForComparison.set([])
    this.shouldCleanInputs.set(true)
  }

  onHandleComparison(ids: WritableSignal<string[]>) {
    this.isLoading.set(true)

    if (ids().length === 1 && ids() != null) {
      this.investmentApiService.getInvestmentById(ids().at(0))
        .pipe(
          finalize(() => this.isLoading.set(false))
        )
        .subscribe({
          next: (data) => {
            this.selectedForComparison.set(data)
          },
          error: () => this.toastService.show('Failed to load', 'error')
        })
    }

    const data = this.localStorageService.list();

    const dataFiltered = data.filter(item => ids().has(item.id))

    this.selectedForComparison.set(dataFiltered)
  }
}
