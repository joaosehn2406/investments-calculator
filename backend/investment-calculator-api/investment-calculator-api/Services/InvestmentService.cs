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

  public async Task<Guid> Save(SaveInvestmentRequest request)
  {
    var investment = new Investment
    {
      Id = Guid.NewGuid(),
      Title = request.Title,
      Description = request.Description,
      Currency = request.Currency,
      InvestmentType = request.InvestmentType,
      CalculatedAt = DateTime.UtcNow,

      Results = request.Results.Select(r => new InvestmentResult
      {
        Id = Guid.NewGuid(),
        Period = r.Period,
        InvestmentValue = r.InvestmentValue,
        InterestYear = r.InterestYear,
        TotalInterest = r.TotalInterest,
        InvestedCapital = r.InvestedCapital
      }).ToList()
    };

    _db.Investments.Add(investment);
    await _db.SaveChangesAsync();

    return investment.Id;
  }

  public CalculationResponse Calculate(CalculationRequest request)
  {
    var initialInvestment = request.InitialInvestment!.Value;
    var financialContribution = request.FinancialContribution!.Value;
    var expectedReturn = request.ExpectedReturn!.Value;
    var duration = request.Duration!.Value;

    var isMonthly = string.Equals(request.Period, "month", StringComparison.OrdinalIgnoreCase);

    var periodsTotal = isMonthly ? duration * 12 : duration;
    var rate = isMonthly
      ? expectedReturn / 100m / 12m
      : expectedReturn / 100m;
    var contribution = isMonthly
      ? financialContribution / 12m
      : financialContribution;

    var balance = initialInvestment;
    var totalInvestment = initialInvestment;

    var results = new List<InvestmentPeriodResult>(periodsTotal);

    for (var period = 1; period <= periodsTotal; period++)
    {
      var interestPeriod = balance * rate;
      balance += interestPeriod + contribution;
      totalInvestment += contribution;
      var totalInterest = balance - totalInvestment;

      results.Add(new InvestmentPeriodResult(
        Period: period,
        InvestmentValue: Math.Round(balance, 2),
        InterestYear: Math.Round(interestPeriod, 2),
        TotalInterest: Math.Round(totalInterest, 2),
        InvestedCapital: Math.Round(totalInvestment, 2),
        InvestmentType: request.Period,
        Currency: request.Currency
      ));
    }

    return new CalculationResponse(results);
  }

  public async Task<List<Investment>> GetAllInvestments(string? search)
  {
    var query = _db.Investments.AsQueryable();

    if (!string.IsNullOrWhiteSpace(search))
    {
      query = query.Where(investment =>
        investment.Title.ToLower().Contains(search.ToLower()) ||
        investment.Description.ToLower().Contains(search.ToLower())
      );
    }

    return await query.ToListAsync();
  }

  public async Task<InvestmentDetailsResponse?> GetInvestmentById(Guid id)
  {
    var investment = await _db.Investments
      .Include(i => i.Results.OrderBy(result => result.Period))
      .FirstOrDefaultAsync(i => i.Id == id);

    if (investment is null) return null;

    return new InvestmentDetailsResponse(
      investment.Id,
      investment.Title,
      investment.Description,
      investment.Currency,
      investment.InvestmentType,
      investment.CalculatedAt,
      investment.Results.Select(result => new InvestmentResultDto(
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
    var investments = await _db.Investments
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

    var items = investments.Select(inv => new InvestmentDetailsResponse(
      inv.Id,
      inv.Title,
      inv.Description,
      inv.Currency,
      inv.InvestmentType,
      inv.CalculatedAt,
      inv.Results.Select(r => new InvestmentResultDto(
        r.Period,
        r.InvestmentValue,
        r.InterestYear,
        r.TotalInterest,
        r.InvestedCapital
      )).ToList()
    )).ToList();

    return NetworkResult.Ok(new CompareInvestmentResponse(items));
  }

  public async Task<NetworkResult?> DeleteInvestmentById(Guid id)
  {
    var investment = await _db.Investments
      .Where(i => i.Id.Equals(id))
      .Include(i => i.Results)
      .FirstOrDefaultAsync();

    if (investment is null)
    {
      return NetworkResult.Fail("Investment not found");
    }

    _db.InvestmentResults.RemoveRange(investment.Results);
    _db.Investments.Remove(investment);
    await _db.SaveChangesAsync();

    return NetworkResult.OkDelete(investment.Title);
  }
}
