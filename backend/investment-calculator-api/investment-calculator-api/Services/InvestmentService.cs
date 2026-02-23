using investment_calculator_api.DTO;

namespace investment_calculator_api.Services;

public class InvestmentService
{
  public CalculationResponse Calculate(CalculationRequest request)
  {
    var isMonthly = string.Equals(request.Period, "monthly", StringComparison.OrdinalIgnoreCase);

    var periodsTotal = isMonthly ? request.Duration * 12 : request.Duration;
    var rate = isMonthly
      ? request.ExpectedReturn / 100m / 12m
      : request.ExpectedReturn / 100m;
    var contribution = isMonthly
      ? request.FinancialContribution / 12m
      : request.FinancialContribution;

    var balance = request.InitialInvestment;
    var totalInvestment = request.InitialInvestment;

    var results = new List<InvestmentPeriodResult>(periodsTotal);

    for (var period = 1; period <= periodsTotal; period++)
    {
      decimal totalInterest = 0;
      var interestPeriod = balance * rate;
      balance += interestPeriod + contribution;
      totalInvestment += contribution;
      totalInterest = balance - totalInvestment;

      results.Add(new InvestmentPeriodResult(
        Period: period,
        InvestmentValue: Math.Round(balance, 2),
        InterestYear: Math.Round(interestPeriod, 2),
        TotalInterest: Math.Round(totalInterest, 2),
        InvestedCapital: Math.Round(totalInvestment, 2),
        InvestmentType: request.Period,
        Currency: request.Currency
      ));
    }

    return new CalculationResponse(results);
  }
}
