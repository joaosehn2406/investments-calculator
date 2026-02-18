import {Component, inject, signal} from '@angular/core';
import {BoardModel, CurrencyType, PeriodType} from './shared/model/board.model';
import {InvestmentModel} from './shared/model/investment.model';
import {HeaderComponent} from './features/header/header.component';
import {BoardComponent} from './features/board/board.component';
import {InvestmentTableComponent} from './features/investment-table/investment.table.component';
import {CalculationService} from './core/services/calculation.service';
import {FooterComponent} from './features/footer/footer.component';
import {ToastComponent} from './shared/toast/toast.component';

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
  result = signal<InvestmentModel[]>([]);
  selectedPeriod = signal<PeriodType>('year')
  selectedCurrency = signal<CurrencyType>('USD')

  onCalculate(data: BoardModel) {
    this.result.set(this.calculationService.calculate(data));
    this.selectedPeriod.set(data.period);
    this.selectedCurrency.set(data.currency)
  }

  onDeleteAllData() {
    this.result.set([])
  }
}
