using investment_calculator_api.Model;
using Microsoft.EntityFrameworkCore;

namespace investment_calculator_api.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options)
  {
  }

  public DbSet<Simulation> Simulation { get; set; }
  public DbSet<SimulationResults> SimulationResults { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<SimulationResults>()
      .HasOne(r => r.Simulation)
      .WithMany(s => s.Results)
      .HasForeignKey(r => r.InvestmentId);
  }
}
