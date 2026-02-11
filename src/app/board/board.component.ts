import {Component, EventEmitter, Output, signal} from '@angular/core';
import {BoardModel} from './board.model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  imports: [
    FormsModule
  ]
})
export class BoardComponent {
  @Output() onClickCalculate = new EventEmitter<BoardModel>();

  defaultData: BoardModel = {
    initialInvestment: 10,
    annualInvestment: 0,
    expectedReturn: 5,
    duration: 10,
  };

  data = signal<BoardModel>({...this.defaultData});

  onCalculate() {
    this.onClickCalculate.emit(this.data());
    this.data.set({...this.defaultData});
  }
}
