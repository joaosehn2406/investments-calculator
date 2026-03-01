using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace investment_calculator_api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreaate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Investments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: false),
                    InvestmentType = table.Column<string>(type: "text", nullable: false),
                    CalculatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Investments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InvestmentResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InvestmentId = table.Column<Guid>(type: "uuid", nullable: false),
                    Period = table.Column<int>(type: "integer", nullable: false),
                    InvestmentValue = table.Column<decimal>(type: "numeric", nullable: false),
                    InterestYear = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalInterest = table.Column<decimal>(type: "numeric", nullable: false),
                    InvestedCapital = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvestmentResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvestmentResults_Investments_InvestmentId",
                        column: x => x.InvestmentId,
                        principalTable: "Investments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InvestmentResults_InvestmentId",
                table: "InvestmentResults",
                column: "InvestmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvestmentResults");

            migrationBuilder.DropTable(
                name: "Investments");
        }
    }
}
