using BackendProject.Data;
using Microsoft.AspNetCore.Mvc;
using BackendProject.Models;
using Mysqlx;

namespace BackendProject.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class EvaluationController : Controller
  {
    private readonly ApplicationDbContext _context;

    public EvaluationController(ApplicationDbContext context)
    {
      _context = context;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateEvaluationForm([FromForm] EvaluationFormDto evaluationFormDto)
    {
      try {
        if (evaluationFormDto == null) return BadRequest("Evaluation form is null");

        var evaluationForm = new EvaluationForm {
          EventId = evaluationFormDto.EventId,
          OrganizerId = evaluationFormDto.OrganizerId,
          Title = evaluationFormDto.Title,
          Description = evaluationFormDto.Description,
          CreatedAt = DateTime.Now,
        };

        _context.EvaluationForms.Add(evaluationForm);
        await _context.SaveChangesAsync();

        var evaluationQuestions = new EvaluationQuestion {
          EvaluationFormId = evaluationForm.Id,
          Category = evaluationFormDto.Categories,
          Question = evaluationFormDto.Questions,
        };

        _context.EvaluationQuestions.Add(evaluationQuestions);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Evaluation form created successfully" });
      } catch (Exception ex) {
        return StatusCode(500, ex.Message);
      }
    }
  }
}