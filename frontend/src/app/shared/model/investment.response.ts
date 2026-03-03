export interface InvestmentResponse {
  id: string,
  title: string,
  description: string,
  currency: string,
  investmentType: string,
  calculatedAt: string,
  results: {
    period: number;
    investmentValue: number;
    interestYear: number;
    totalInterest: number;
    investedCapital: number;
  }[];
}
