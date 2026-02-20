import {InvestmentModel} from './investment.model';

export interface LocalStorageModel {
  id: string,
  title: string | null,
  description: string | null,
  createdAt: string,
  results:  InvestmentModel[]
}
