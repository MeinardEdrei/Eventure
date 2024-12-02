using BackendProject.Data;
using Microsoft.AspNetCore.Mvc;
using BackendProject.Models;
using Mysqlx;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

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
      try
      {
        if (evaluationFormDto == null) return BadRequest("Evaluation form is null");

        var evaluationTable = await _context.EvaluationForms.FindAsync(evaluationFormDto.EventId);
        if (evaluationTable != null) return BadRequest("Evaluation form already exists");

        var evaluationForm = new EvaluationForm
        {
          EventId = evaluationFormDto.EventId,
          OrganizerId = evaluationFormDto.OrganizerId,
          Title = evaluationFormDto.Title,
          Description = evaluationFormDto.Description,
          CreatedAt = DateTime.Now,
        };

        _context.EvaluationForms.Add(evaluationForm);
        await _context.SaveChangesAsync();

        var evaluationQuestions = new EvaluationQuestion
        {
          EvaluationFormId = evaluationForm.Id,
          Category = evaluationFormDto.Categories,
          Question = evaluationFormDto.Questions,
        };

        _context.EvaluationQuestions.Add(evaluationQuestions);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Evaluation form created successfully" });
      }
      catch (Exception ex)
      {
        return StatusCode(500, ex.Message);
      }
    }

    [HttpPost("update-form")]
    public async Task<IActionResult> UpdateEvaluationForm([FromForm] EvaluationFormDto evaluationFormDto)
    {
      try
      {
        if (evaluationFormDto == null) return BadRequest("Evaluation form is null");

        // EVALUATION FORM
        var evaluationTable = await _context.EvaluationForms
        .FirstOrDefaultAsync(e => e.EventId == evaluationFormDto.EventId);

        if (evaluationTable == null) return BadRequest("Evaluation form not found");

        evaluationTable.Title = evaluationFormDto.Title;
        evaluationTable.Description = evaluationFormDto.Description;

        _context.EvaluationForms.Update(evaluationTable);
        await _context.SaveChangesAsync();
        
        // EVALUATION QUESTIONS
        var evaluationQuestions = await _context.EvaluationQuestions
        .FirstOrDefaultAsync(e => e.EvaluationFormId == evaluationTable.Id);

        if (evaluationQuestions == null) return BadRequest("Evaluation questions not found");

        evaluationQuestions.Category = evaluationFormDto.Categories;
        evaluationQuestions.Question = evaluationFormDto.Questions;

        _context.EvaluationQuestions.Update(evaluationQuestions);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Evaluation form updated successfully" });
      }
      catch (Exception ex)
      {
        return StatusCode(500, ex.Message);
      }
    }

    [HttpGet("{id}/evaluation-form")]
    public async Task<IActionResult> GetEvaluationForm(int id)
    {
      try
      {
        var evaluationForm = await _context.EvaluationForms
        .FirstOrDefaultAsync(e => e.EventId == id);

        return Ok(evaluationForm);
      }
      catch (Exception ex)
      {
        return StatusCode(500, ex.Message);
      }
    }

    [HttpGet("{id}/post-evaluation")]
    public async Task<IActionResult> GetPostEvaluation(int id)
    {
      var evaluationForm = await _context.EvaluationForms
      .Where(e => e.EventId == id)
      .Include(e => e.EvaluationQuestions)
      .ToListAsync();

      if (evaluationForm == null) return NotFound("Evaluation form not found");

      var response = evaluationForm.Select(evaluationForm => new
      {
        Id = evaluationForm.Id,
        EventId = evaluationForm.EventId,
        Title = evaluationForm.Title,
        Description = evaluationForm.Description,
        EvaluationQuestions = evaluationForm?.EvaluationQuestions?.Select(q => new EvaluationQuestionDto
        {
          Id = q.Id,
          Category = q.Category,
          Question = q.Question
        }).ToArray()
      }).ToArray();

      return Ok(response);
    }

    [HttpDelete("{id}/delete-form")]
    public async Task<IActionResult> DeleteEvaluationForm(int id)
    {
      var evaluationForm = await _context.EvaluationForms
      .FirstOrDefaultAsync(e => e.EventId == id);

      if (evaluationForm == null) return NotFound("Evaluation form not found");

      _context.EvaluationForms.Remove(evaluationForm);
      await _context.SaveChangesAsync();

      return NoContent();
    }
  }
}