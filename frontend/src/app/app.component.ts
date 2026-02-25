import {Component, inject, signal, WritableSignal} from '@angular/core';
import {BoardModel, CurrencyType, PeriodType} from './shared/model/board.model';
import {InvestmentModel} from './shared/model/investment.model';
import {HeaderComponent} from './features/header/header.component';
import {BoardComponent} from './features/board/board.component';
import {InvestmentTableComponent} from './features/investment-table/investment.table.component';
import {CalculationService} from './core/services/calculation.service';
import {FooterComponent} from './features/footer/footer.component';
import {ToastComponent} from './shared/toast/toast.component';
import {LocalStorageService} from './core/services/localStorage.service';
import {LocalStorageModel} from './shared/model/localStorage.model';
import {finalize} from 'rxjs';
import {ToastService} from './core/services/toast.service';

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
  private calculationService = inject(CalculationService)
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

    this.calculationService.calculate(data)
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
        error: () => {
          this.toastService.show('Calculation failed', 'error')
        }
      });
  }

  onDeleteAllData() {
    this.result.set([])
    this.selectedForComparison.set([])
    this.shouldCleanInputs.set(true)
  }

  onHandleComparison(ids: WritableSignal<Set<string>>) {
    const data = this.localStorageService.list();

    const dataFiltered = data.filter(item => ids().has(item.id))

    this.selectedForComparison.set(dataFiltered)
  }
}
