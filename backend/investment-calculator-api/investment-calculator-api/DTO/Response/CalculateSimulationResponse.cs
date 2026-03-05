namespace investment_calculator_api.DTO;

public record CalculateSimulationResponse(
  IEnumerable<CalculateSimulationResult> CalculateSimulationResult
);
