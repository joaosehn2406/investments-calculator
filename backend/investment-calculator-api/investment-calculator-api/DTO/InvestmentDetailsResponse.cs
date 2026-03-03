namespace investment_calculator_api.DTO;

public record InvestmentDetailsResponse(
  Guid Id,
  string Title,
  string Description,
  string Currency,
  string InvestmentType,
  DateTime CalculatedAt,
  List<InvestmentResultDto> Results
  );
