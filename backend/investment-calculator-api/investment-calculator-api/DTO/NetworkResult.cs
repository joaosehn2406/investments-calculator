namespace investment_calculator_api.DTO;

public record NetworkResult(
  bool Success,
  string? Error,
  string? SuccessMessage,
  CompareInvestmentResponse? Data
)
{
  public static NetworkResult Ok(CompareInvestmentResponse data)
  {
    return new NetworkResult(true, null, null, data);
  }

  public static NetworkResult OkDelete(string message)
  {
    return new NetworkResult(true, null, message, null);
  }

  public static NetworkResult Fail(string error)
  {
    return new NetworkResult(false, error, null, null);
  }
}
