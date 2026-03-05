namespace investment_calculator_api.DTO;

public record SimulationDetailsResponse(
  Guid Id,
  string Title,
  string Description,
  string Currency,
  string InvestmentType,
  DateTime CalculatedAt,
  List<SimulationResult> Results
  );
