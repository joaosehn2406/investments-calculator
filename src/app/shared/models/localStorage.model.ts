import {InvestmentModel} from './investment.model';
import {InputSignal} from '@angular/core';

export interface LocalStorageModel {
  id: string,
  title: string | null,
  description: string | null,
  createdAt: string,
  results:  InputSignal<InvestmentModel[]>
}
