export type PeriodType = 'year' | 'month';

export interface BoardModel {
  initialInvestment: number;
  financialContribution: number;
  expectedReturn: number;
  duration: number;
  period: PeriodType;
}
