namespace investment_calculator_api.DTO;

public record CalculateSimulationResult(
  int Period,
  decimal InvestmentValue,
  decimal InterestYear,
  decimal TotalInterest,
  decimal InvestedCapital,
  string InvestmentType,
  string Currency
);
