import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {SaveInvestmentRequest, SaveInvestmentResponse} from '../../shared/model/save.investment.model';
import {Observable} from 'rxjs';
import {BoardModel} from '../../shared/model/board.model';
import {CalculationResponse} from '../../shared/model/calculate.investment.model';
import {InvestmentSummary} from '../../shared/model/InvestmentSummary';
import {InvestmentResponse} from '../../shared/model/investment.response';
import {CompareInvestmentResponse} from '../../shared/model/CompareInvestmentResponse';

@Injectable({providedIn: 'root'})
export class InvestmentApiService {

  private http = inject(HttpClient)
  private baseUrl = `${environment.apiUrl}/investments`

  calculate(inputs: BoardModel): Observable<CalculationResponse> {
    return this.http.post<CalculationResponse>(`${this.baseUrl}/calculate`, inputs)
  }

  saveInvestment(request: SaveInvestmentRequest): Observable<SaveInvestmentResponse> {
    return this.http.post<SaveInvestmentResponse>(`${this.baseUrl}/save`, request)
  }

  getAllInvestments(search?: string): Observable<InvestmentSummary[]> {
    let params = new HttpParams()

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<InvestmentSummary[]>(this.baseUrl, {params})
  }

  getInvestmentById(id: string | undefined): Observable<InvestmentResponse> {
    return this.http.get<InvestmentResponse>(`${this.baseUrl}/${id}`);
  }

  getComparableInvestments(ids: string[]): Observable<CompareInvestmentResponse> {
    const params = new HttpParams({fromObject: {ids}})
    return this.http.get<CompareInvestmentResponse>(`${this.baseUrl}/compare`, {params})
  }
}
