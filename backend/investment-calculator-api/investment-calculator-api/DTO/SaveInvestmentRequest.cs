using System.ComponentModel.DataAnnotations;

namespace investment_calculator_api.DTO;

public record SaveInvestmentRequest(
  [Required] string Title,
  [Required] string Description,
  [Required] string Currency,
  [Required] string InvestmentType,
  [Required] List<InvestmentResultRequest> Results
);
