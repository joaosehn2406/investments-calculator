using investment_calculator_api.Data;
using investment_calculator_api.DTO;
using investment_calculator_api.Model;
using Microsoft.EntityFrameworkCore;

namespace investment_calculator_api.Services;

public class InvestmentService
{
  private readonly AppDbContext _db;

  public InvestmentService(AppDbContext db)
    => _db = db;

  public async Task<Guid> Save(SaveSimulationRequest request)
  {
    var simulation = new Simulation
    {
      Id = Guid.NewGuid(),
      Title = request.Title,
      Description = request.Description,
      Currency = request.Currency,
      InvestmentType = request.InvestmentType,
      CalculatedAt = DateTime.UtcNow,

      Results = request.Results.Select(r => new SimulationResults
      {
        Id = Guid.NewGuid(),
        Period = r.Period,
        InvestmentValue = r.InvestmentValue,
        InterestYear = r.InterestYear,
        TotalInterest = r.TotalInterest,
        InvestedCapital = r.InvestedCapital
      }).ToList()
    };

    _db.Simulation.Add(simulation);
    await _db.SaveChangesAsync();

    return simulation.Id;
  }

  public CalculateSimulationResponse Calculate(CalculateSimulationRequest request)
  {
    var initialInvestment = request.InitialInvestment!.Value;
    var financialContribution = request.FinancialContribution!.Value;
    var expectedReturn = request.ExpectedReturn!.Value;
    var duration = request.Duration!.Value;

    var isMonthly = string.Equals(request.InterestType, "month", StringComparison.OrdinalIgnoreCase);

    var periodsTotal = isMonthly ? duration * 12 : duration;
    var rate = isMonthly
      ? expectedReturn / 100m / 12m
      : expectedReturn / 100m;
    var contribution = isMonthly
      ? financialContribution / 12m
      : financialContribution;

    var balance = initialInvestment;
    var totalInvestment = initialInvestment;

    var results = new List<CalculateSimulationResult>(periodsTotal);

    for (var period = 1; period <= periodsTotal; period++)
    {
      var interestPeriod = balance * rate;
      balance += interestPeriod + contribution;
      totalInvestment += contribution;
      var totalInterest = balance - totalInvestment;

      results.Add(new CalculateSimulationResult(
        Period: period,
        InvestmentValue: Math.Round(balance, 2),
        InterestYear: Math.Round(interestPeriod, 2),
        TotalInterest: Math.Round(totalInterest, 2),
        InvestedCapital: Math.Round(totalInvestment, 2),
        InvestmentType: request.InterestType,
        Currency: request.Currency
      ));
    }

    return new CalculateSimulationResponse(results);
  }

  public async Task<List<Simulation>> GetAllInvestments(string? search)
  {
    var query = _db.Simulation.AsQueryable();

    if (!string.IsNullOrWhiteSpace(search))
    {
      query = query.Where(investment =>
        investment.Title.ToLower().Contains(search.ToLower()) ||
        investment.Description.ToLower().Contains(search.ToLower())
      );
    }

    return await query.ToListAsync();
  }

  public async Task<SimulationDetailsResponse?> GetInvestmentById(Guid id)
  {
    var investment = await _db.Simulation
      .Include(i => i.Results.OrderBy(result => result.Period))
      .FirstOrDefaultAsync(i => i.Id == id);

    if (investment is null) return null;

    return new SimulationDetailsResponse(
      investment.Id,
      investment.Title,
      investment.Description,
      investment.Currency,
      investment.InvestmentType,
      investment.CalculatedAt,
      investment.Results.Select(result => new SimulationResult(
        result.Period,
        result.InvestmentValue,
        result.InterestYear,
        result.TotalInterest,
        result.InvestedCapital
      )).ToList()
    );
  }

  public async Task<NetworkResult?> CompareInvestments(List<Guid> ids)
  {
    var investments = await _db.Simulation
      .Where(i => ids.Contains(i.Id))
      .Include(i => i.Results.OrderBy(r => r.Period))
      .ToListAsync();

    if (investments.Count != ids.Count)
    {
      return NetworkResult.Fail("One or more investments not found");
    };

    if (investments[0].InvestmentType != investments[1].InvestmentType)
    {
      return NetworkResult.Fail("Invesments must have the same type to compare");
    }

    var items = investments.Select(inv => new SimulationDetailsResponse(
      inv.Id,
      inv.Title,
      inv.Description,
      inv.Currency,
      inv.InvestmentType,
      inv.CalculatedAt,
      inv.Results.Select(r => new SimulationResult(
        r.Period,
        r.InvestmentValue,
        r.InterestYear,
        r.TotalInterest,
        r.InvestedCapital
      )).ToList()
    )).ToList();

    return NetworkResult.Ok(new CompareSimulationResponse(items));
  }

  public async Task<NetworkResult?> DeleteInvestmentById(Guid id)
  {
    var investment = await _db.Simulation
      .Where(i => i.Id.Equals(id))
      .Include(i => i.Results)
      .FirstOrDefaultAsync();

    if (investment is null)
    {
      return NetworkResult.Fail("Investment not found");
    }

    _db.SimulationResults.RemoveRange(investment.Results);
    _db.Simulation.Remove(investment);
    await _db.SaveChangesAsync();

    return NetworkResult.OkDelete(investment.Title);
  }
}
