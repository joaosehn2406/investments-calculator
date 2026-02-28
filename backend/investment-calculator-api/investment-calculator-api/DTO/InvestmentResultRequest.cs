namespace investment_calculator_api.DTO;

public record InvestmentResultRequest(
  int Period,
  decimal InvestmentValue,
  decimal InterestYear,
  decimal TotalInterest,
  decimal InvestedCapital
);
