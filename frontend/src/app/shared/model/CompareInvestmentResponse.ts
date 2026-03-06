import {InvestmentResponse} from './investment.response';

export interface CompareSimulationData {
  comparableSimulations: InvestmentResponse[]
}

export interface CompareInvestmentResponse {
  success: boolean;
  error: string | null;
  successMessage: string | null;
  data: CompareSimulationData;
}
