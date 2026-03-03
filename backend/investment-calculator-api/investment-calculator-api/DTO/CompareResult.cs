namespace investment_calculator_api.DTO;

public record CompareResult(
  bool Success,
  string? Error,
  CompareInvestmentResponse? Data
)
{
  public static CompareResult Ok(CompareInvestmentResponse data)
  {
    return new CompareResult(true, null, data);
  }

  public static CompareResult Fail(string error)
  {
    return new CompareResult(false, error, null);
  }
}
