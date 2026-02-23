import {inject, Injectable} from '@angular/core';
import {BoardModel} from '../../shared/model/board.model';
import {InvestmentModel} from '../../shared/model/investment.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

interface CalculationResponse {
  results: InvestmentModel[]
}

@Injectable({providedIn: 'root'})
export class CalculationService {
  private http = inject(HttpClient)
  private apiUrl = 'http://localhost:5000/api/investments/calculate'

  calculate(inputs: BoardModel): Observable<CalculationResponse> {
    return this.http.post<CalculationResponse>(this.apiUrl, inputs)
  }
}
