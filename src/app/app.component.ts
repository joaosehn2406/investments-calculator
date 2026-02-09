import { Component } from '@angular/core';
import {BoardModel} from './board/board.model';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  onCalculate(data: BoardModel) {

  }
}
