using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace investment_calculator_api.Migrations
{
  /// <inheritdoc />
  public partial class RenamedTables : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.RenameTable(
        name: "InvestmentResults",
        newName: "SimulationResults");

      migrationBuilder.RenameTable(
        name: "Investments",
        newName: "Simulation");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.RenameTable(
        name: "SimulationResults",
        newName: "InvestmentResults");

      migrationBuilder.RenameTable(
        name: "Simulation",
        newName: "Investments");
    }
  }
}
