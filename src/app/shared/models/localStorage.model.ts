import {InvestmentModel} from './investment.model';

export interface LocalStorageModel {
  id: string,
  title: string,
  createdAt: string,
  results: InvestmentModel[];
}
