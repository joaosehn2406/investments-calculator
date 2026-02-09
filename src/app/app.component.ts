import {Component, inject} from '@angular/core';
import {BoardModel} from './board/board.model';
import {AppService} from './app.service';
import {InvestmentModel} from './investment-table/invesmentModel';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private appService = inject(AppService)
  result: InvestmentModel[] = []

  onCalculate(data: BoardModel) {
    this.result = this.appService.calculate(data)
  }
}
