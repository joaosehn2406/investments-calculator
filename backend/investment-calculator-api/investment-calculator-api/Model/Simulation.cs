namespace investment_calculator_api.Model;

public class Simulation
{
  public Guid Id { get; set; }
  public string Title { get; set; }
  public string Description { get; set; }
  public string Currency { get; set; }
  public string InvestmentType { get; set; }
  public DateTime CalculatedAt { get; set; }

  public List<SimulationResults> Results { get; set; } = [];
}
