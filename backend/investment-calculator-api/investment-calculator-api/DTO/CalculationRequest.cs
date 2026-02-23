namespace investment_calculator_api.DTO;

public record CalculationRequest(
  decimal InitialInvestment,
  decimal FinancialContribution,
  decimal ExpectedReturn,
  int Duration,
  string Period,
  string Currency
);
