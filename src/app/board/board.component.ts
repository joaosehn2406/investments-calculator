import {Component, EventEmitter, Output} from '@angular/core';
import {BoardModel} from './board.model';

@Component({
  selector: 'app-board',
  standalone: false,
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  @Output() onClickCalculate = new EventEmitter<BoardModel>();

  data: BoardModel = {
    initialInvestment: 10,
    annualInvestment: 0,
    expectedReturn: 5,
    duration: 10,
  };

  onCalculate() {
    this.onClickCalculate.emit(this.data)
  }
}
