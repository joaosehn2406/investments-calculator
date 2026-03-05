namespace investment_calculator_api.DTO;

public record CompareSimulationResponse(
    List<SimulationDetailsResponse> ComparableSimulations
  );
