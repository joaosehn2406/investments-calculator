using System.ComponentModel.DataAnnotations;

namespace investment_calculator_api.DTO;

public record CalculationRequest(

	[Required(ErrorMessage = "Cannot be blank")]
  [Range(0.01, 9.9e14, ErrorMessage = "InitialInvestment must be greater than zero")]
  decimal? InitialInvestment,

  [Range(0, 9.9e14, ErrorMessage = "FinancialContribution must be greater or equals to 0")]
  decimal? FinancialContribution,

  [Range(0.01, 100, ErrorMessage = "Expected return must be greater than 0")]
  decimal? ExpectedReturn,

  [Range(1, 100, ErrorMessage = "Duration must be at least 1 year")]
  int? Duration,

  [Required(ErrorMessage = "Period cannot be blank")]
  string? Period,

  [Required(ErrorMessage = "Currency cannot be blank")]
  string? Currency

);
