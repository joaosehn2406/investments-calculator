import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {SaveInvestmentRequest, SaveInvestmentResponse} from '../../shared/model/save.investment.model';
import {Observable} from 'rxjs';
import {BoardModel} from '../../shared/model/board.model';
import {CalculationResponse} from '../../shared/model/calculate.investment.model';

@Injectable({ providedIn: 'root' })
export class InvestmentApiService {

  private http = inject(HttpClient)
  private baseUrl = `${environment.apiUrl}/investments`

  calculate(inputs: BoardModel): Observable<CalculationResponse> {
    return this.http.post<CalculationResponse>(`${this.baseUrl}/calculate`, inputs)
  }

  saveInvestment(request: SaveInvestmentRequest): Observable<SaveInvestmentResponse> {
    return this.http.post<SaveInvestmentResponse>(`${this.baseUrl}/save`, request)
  }
}
