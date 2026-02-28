using investment_calculator_api.Model;
using Microsoft.EntityFrameworkCore;

namespace investment_calculator_api.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options)
  {
  }

  public DbSet<Investment> Investments { get; set; }
  public DbSet<InvestmentResult> InvestmentResults { get; set; }
}
