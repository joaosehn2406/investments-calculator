using investment_calculator_api.DTO;

namespace investment_calculator_api.Services;

public class InvestmentService
{
  public CalculationResponse Calculate(CalculationRequest request)
  {
    // Valores já validados pelo controller - seguros para usar .Value
    var initialInvestment = request.InitialInvestment!.Value;
    var financialContribution = request.FinancialContribution!.Value;
    var expectedReturn = request.ExpectedReturn!.Value;
    var duration = request.Duration!.Value;

    var isMonthly = string.Equals(request.Period, "month", StringComparison.OrdinalIgnoreCase);

    var periodsTotal = isMonthly ? duration * 12 : duration;
    var rate = isMonthly
      ? expectedReturn / 100m / 12m
      : expectedReturn / 100m;
    var contribution = isMonthly
      ? financialContribution / 12m
      : financialContribution;

    var balance = initialInvestment;
    var totalInvestment = initialInvestment;

    var results = new List<InvestmentPeriodResult>(periodsTotal);

    for (var period = 1; period <= periodsTotal; period++)
    {
      var interestPeriod = balance * rate;
      balance += interestPeriod + contribution;
      totalInvestment += contribution;
      var totalInterest = balance - totalInvestment;

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
