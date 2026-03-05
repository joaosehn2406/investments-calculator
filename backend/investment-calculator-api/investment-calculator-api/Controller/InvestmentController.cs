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
  public IActionResult Calculate([FromBody] CalculateSimulationRequest request)
  {
    if (!ModelState.IsValid)
      return BadRequest(ModelState);

    var response = _investmentService.Calculate(request);
    return Ok(response);
  }

  [HttpPost("save")]
  public async Task<IActionResult> SaveInvestment([FromBody] SaveSimulationRequest request)
  {
    if (!ModelState.IsValid)
      return BadRequest(ModelState);

    var id = await _investmentService.Save(request);
    return Ok(new { id });
  }

  [HttpGet]
  public async Task<IActionResult> GetAllInvestments([FromQuery] string? search)
  {
    var investments = await _investmentService.GetAllInvestments(search);
    return Ok(investments);
  }

  [HttpGet("{id:guid}")]
  public async Task<IActionResult> GetInvestmentById(Guid id)
  {
    var investment = await _investmentService.GetInvestmentById(id);
    if (investment == null) return NotFound();
    return Ok(investment);
  }

  [HttpGet("compare")]
  public async Task<IActionResult> CompareInvestments([FromQuery] List<Guid> ids)
  {
    if (ids.Count != 2)
    {
      return BadRequest(new { error = "Exactly 2 Ids are required" });
    }

    var result = await _investmentService.CompareInvestments(ids);

    if (!result.Success)
    {
      return BadRequest(new { error = result.Error });
    }

    return Ok(result);
  }

  [HttpDelete("{id:guid}")]
  public async Task<IActionResult> DeleteInvestmentById(Guid id)
  {
    var result = await _investmentService.DeleteInvestmentById(id);

    if (!result.Success)
      return NotFound(new { error = result.Error });

    return NoContent();
  }
}
