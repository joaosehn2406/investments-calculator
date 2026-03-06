using System.ComponentModel.DataAnnotations.Schema;

namespace investment_calculator_api.Model;

public class SimulationResults
{
  public Guid Id { get; set; }
  public Guid InvestmentId { get; set; }
  public int Period { get; set; }
  public decimal InvestmentValue { get; set; }
  public decimal InterestYear { get; set; }
  public decimal TotalInterest { get; set; }
  public decimal InvestedCapital { get; set; }

  [ForeignKey("InvestmentId")]
  public Simulation Simulation { get; set; } = null!;
}
