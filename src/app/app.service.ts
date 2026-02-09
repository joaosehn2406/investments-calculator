import {Injectable} from '@angular/core';
import {ResultsModel} from './results.model';
import {BoardModel} from './board/board.model';

@Injectable({ providedIn: 'root' })
export class AppService{

  calculate(inputs: BoardModel): ResultsModel[] {
    for(let year = 1; year < inputs.duration; year++) {

    }
  }
}
