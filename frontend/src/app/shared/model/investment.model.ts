import {CurrencyType, PeriodType} from './board.model';

export interface InvestmentModel {
  period: number,
  investmentValue: number,
  interestYear: number,
  totalInterest: number,
  investedCapital: number,
  investmentType: PeriodType,
  currency: CurrencyType
}
