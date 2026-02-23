using Microsoft.EntityFrameworkCore;

namespace investment_calculator_api.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options)
  {
  }
}
