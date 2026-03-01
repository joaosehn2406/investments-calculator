export interface SaveInvestmentResultItem {
  period: number,
  investmentValue: number,
  interestYear: number,
  totalInterest: number,
  investedCapital: number;
}

export interface SaveInvestmentRequest {
  title: string,
  description: string,
  currency: string,
  investmentType: string,
  results: SaveInvestmentResultItem[]
}

export interface SaveInvestmentResponse {
  id: string;
}
