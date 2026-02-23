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

  result = signal<InvestmentModel[]>([]);
  selectedPeriod = signal<PeriodType>('year')
  selectedCurrency = signal<CurrencyType>('USD')
  selectedForComparison = signal<LocalStorageModel[]>([]);

  onCalculate(data: BoardModel) {
    this.result.set(this.calculationService.calculate(data));
    this.selectedPeriod.set(data.period);
    this.selectedCurrency.set(data.currency)
    this.selectedForComparison.set([])
  }

  onDeleteAllData() {
    this.result.set([])
    this.selectedForComparison.set([])
  }

  onHandleComparison(ids: WritableSignal<Set<string>>) {
    const data = this.localStorageService.list();

    const dataFiltered = data.filter(item => ids().has(item.id))

    this.selectedForComparison.set(dataFiltered)

    debugger
  }
}
