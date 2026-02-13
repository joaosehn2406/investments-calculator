import {Injectable} from '@angular/core';
import {BoardModel} from '../../shared/models/board.model';
import {InvestmentModel} from '../../shared/models/investment.model';

@Injectable({providedIn: 'root'})
export class CalculationService {

  calculate(inputs: BoardModel): InvestmentModel[] {
    const results: InvestmentModel[] = [];
    const isMonthly = inputs.period === 'month';
    
    const periodsTotal = isMonthly ? inputs.duration * 12 : inputs.duration;
    const rate = isMonthly ? (inputs.expectedReturn / 100) / 12 : inputs.expectedReturn / 100;
    const contribution = isMonthly ? inputs.financialContribution / 12 : inputs.financialContribution;

    let balance = inputs.initialInvestment;
    let totalInvested = inputs.initialInvestment;
    let totalInterest = 0;

    for (let period = 1; period <= periodsTotal; period++) {
      const interestPeriod = balance * rate;
      balance += interestPeriod + contribution;
      totalInvested += contribution;
      totalInterest = balance - totalInvested;

      results.push({
        period,
        investedCapital: totalInvested,
        interestYear: interestPeriod,
        investmentValue: balance,
        totalInterest,
        investmentType: inputs.period
      });
    }

    return results;
  }
}
