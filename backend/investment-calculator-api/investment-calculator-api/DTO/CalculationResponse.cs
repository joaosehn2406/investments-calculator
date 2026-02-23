namespace investment_calculator_api.DTO;

public record CalculationResponse(
  IEnumerable<InvestmentPeriodResult> Results
);
