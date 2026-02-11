import {Component, inject} from '@angular/core';
import {BoardModel} from './board/board.model';
import {AppService} from './app.service';
import {InvestmentModel} from './investment-table/invesmentModel';
import {HeaderComponent} from './header/header.component';
import {BoardComponent} from './board/board.component';
import {InvestmentTable} from './investment-table/investment-table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    HeaderComponent,
    BoardComponent,
    InvestmentTable
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {

  private appService = inject(AppService)
  result: InvestmentModel[] = []

  onCalculate(data: BoardModel) {
    this.result = this.appService.calculate(data)
  }
}
