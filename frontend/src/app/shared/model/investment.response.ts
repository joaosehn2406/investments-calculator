export interface InvestmentResponse {
  id: string,
  description: string,
  currency: string,
  investmentType: string,
  results: {
    period: number;
    investmentValue: number;
    interestYear: number;
    totalInterest: number;
    investedCapital: number;
  }[];
}
