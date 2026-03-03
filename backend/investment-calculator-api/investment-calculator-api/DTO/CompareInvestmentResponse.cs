namespace investment_calculator_api.DTO;

public record CompareInvestmentResponse(
    List<InvestmentDetailsResponse> ComparableItems
  );
