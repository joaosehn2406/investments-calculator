namespace investment_calculator_api.DTO;

public record InvestmentResultDto(
  int Period,
  decimal InvestmentValue,
  decimal InterestYear,
  decimal TotalInterest,
  decimal InvestedCapital
);
