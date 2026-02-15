import {Component, inject, signal} from '@angular/core';
import {BoardModel} from './shared/models/board.model';
import {InvestmentModel} from './shared/models/investment.model';
import {HeaderComponent} from './features/header/header.component';
import {BoardComponent} from './features/board/board.component';
import {InvestmentTableComponent} from './features/investment-table/investment.table.component';
import {CalculationService} from './core/services/calculation.service';
import {FooterComponent} from './features/footer/footer.component';
import {ToastComponent} from './shared/toast/toast.component';
import {LocalStorageService} from './core/services/localStorage.service';

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

  private localStorageService = inject(LocalStorageService)

  private calculationService = inject(CalculationService)
  result = signal<InvestmentModel[]>([]);

  onCalculate(data: BoardModel) {
    const results = this.calculationService.calculate(data)

    this.result.set(results)

    this.localStorageService.add({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: `Simulação - ${new Date().toLocaleString()}`,
      results: results
    });
  }
}
