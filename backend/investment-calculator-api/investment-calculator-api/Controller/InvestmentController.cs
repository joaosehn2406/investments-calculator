using investment_calculator_api.DTO;
using investment_calculator_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace investment_calculator_api.Controller;

[ApiController]
[Route("api/investments")]
public class InvestmentController : ControllerBase
{
  private readonly InvestmentService _investmentService;

  public InvestmentController(InvestmentService investmentService)
    => _investmentService = investmentService;

  [HttpPost("calculate")]
  public IActionResult Calculate([FromBody] CalculationRequest request)
  {
    if (!ModelState.IsValid)
      return BadRequest(ModelState);

    var response = _investmentService.Calculate(request);
    return Ok(response);
  }
}
