import {InvestmentModel} from './investment.model';
import {PeriodType} from './board.model';

export interface LocalStorageModel {
  id: string,
  title: string | null,
  description: string | null,
  periodType: PeriodType | null,
  createdAt: string,
  results:  InvestmentModel[]
}
