import {Component, inject, signal} from '@angular/core';
import {BoardModel} from './shared/models/board.model';
import {InvestmentModel} from './shared/models/investment.model';
import {HeaderComponent} from './features/header/header.component';
import {BoardComponent} from './features/board/board.component';
import {InvestmentTableComponent} from './features/investment-table/investment.table.component';
import {CalculationService} from './core/services/calculation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    HeaderComponent,
    BoardComponent,
    InvestmentTableComponent
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {

  private calculationService = inject(CalculationService)
  result = signal<InvestmentModel[]>([]);

  onCalculate(data: BoardModel) {
    this.result.set(this.calculationService.calculate(data))
  }
}
