import {Injectable} from '@angular/core';
import {BoardModel} from './board/board.model';
import {InvestmentModel} from './investment-table/invesmentModel';

@Injectable({providedIn: 'root'})
export class AppService {

  calculate(inputs: BoardModel): InvestmentModel[] {
    const results = []
    const r = inputs.expectedReturn / 100

    let balance = inputs.initialInvestment
    let totalInvested = inputs.initialInvestment
    let totalInterest = 0

    for (let year = 1; year <= inputs.duration; year++) {
      const interestYear = balance * r
      balance += interestYear

      totalInvested += inputs.annualInvestment
      balance += inputs.annualInvestment

      totalInterest = balance - totalInvested

      results.push({
        year,
        investedCapital: totalInvested,
        interestYear,
        investmentValue: balance,
        totalInterest
      })
    }

    return results
  }
}
