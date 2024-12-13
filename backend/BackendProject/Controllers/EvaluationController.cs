using BackendProject.Data;
using Microsoft.AspNetCore.Mvc;
using BackendProject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

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
        public async Task<IActionResult> CreateEvaluationForm([FromBody] EvaluationFormDto evaluationFormDto)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try 
                {
                    // Create Evaluation Form
                    var evaluationForm = new EvaluationForm
                    {
                        EventId = evaluationFormDto.EventId,
                        OrganizerId = evaluationFormDto.OrganizerId,
                        Title = evaluationFormDto.Title,
                        Description = evaluationFormDto.Description,
                        CreatedAt = DateTime.Now
                    };
                    _context.EvaluationForms.Add(evaluationForm);
                    await _context.SaveChangesAsync();

                    // Create Categories and Questions
                    if (evaluationFormDto.Categories != null)
                    {
                        foreach (var categoryDto in evaluationFormDto.Categories)
                        {
                            var category = new EvaluationCategory
                            {
                                EvaluationFormId = evaluationForm.Id,
                                Name = categoryDto.Name
                            };
                            _context.EvaluationCategories.Add(category);
                            await _context.SaveChangesAsync();

                            // Create Questions
                            if (categoryDto.Questions != null)
                            {
                                foreach (var questionDto in categoryDto.Questions)
                                {
                                    var question = new EvaluationQuestion
                                    {
                                        EvaluationCategoryId = category.Id,
                                        QuestionText = questionDto.QuestionText
                                    };
                                    _context.EvaluationQuestions.Add(question);
                                }
                            }
                        }
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Ok(new { message = "Evaluation form created successfully", formId = evaluationForm.Id });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, new { message = "Error creating evaluation form", error = ex.Message });
                }
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateEvaluationForm(int id, [FromBody] EvaluationFormDto evaluationFormDto)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Find existing evaluation form
                    var evaluationForm = await _context.EvaluationForms.FindAsync(id);
                    if (evaluationForm == null) return NotFound("Evaluation form not found");

                    // Update evaluation form details
                    evaluationForm.Title = evaluationFormDto.Title;
                    evaluationForm.Description = evaluationFormDto.Description;

                    _context.EvaluationForms.Update(evaluationForm);
                    await _context.SaveChangesAsync();

                    // Update Categories and Questions
                    if (evaluationFormDto.Categories != null)
                    {
                        // Clear existing categories and questions
                        var existingCategories = await _context.EvaluationCategories
                            .Where(c => c.EvaluationFormId == evaluationForm.Id)
                            .Include(c => c.Questions)
                            .ToListAsync();

                        _context.EvaluationCategories.RemoveRange(existingCategories);
                        await _context.SaveChangesAsync();

                        foreach (var categoryDto in evaluationFormDto.Categories)
                        {
                            var category = new EvaluationCategory
                            {
                                EvaluationFormId = evaluationForm.Id,
                                Name = categoryDto.Name
                            };
                            _context.EvaluationCategories.Add(category);
                            await _context.SaveChangesAsync();

                            // Create Questions
                            if (categoryDto.Questions != null)
                            {
                                foreach (var questionDto in categoryDto.Questions)
                                {
                                    var question = new EvaluationQuestion
                                    {
                                        EvaluationCategoryId = category.Id,
                                        QuestionText = questionDto.QuestionText
                                    };
                                    _context.EvaluationQuestions.Add(question);
                                }
                            }
                        }
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return Ok(new { message = "Evaluation form updated successfully" });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, new { message = "Error updating evaluation form", error = ex.Message });
                }
            }
        }

        [HttpGet("{id}/evaluation-form")]
        public async Task<IActionResult> GetEvaluationForm(int id)
        {
            try
            {
                var evaluationForm = await _context.EvaluationForms
                    .Include(e => e.EvaluationCategories)
                        .ThenInclude(c => c.Questions)
                    .FirstOrDefaultAsync(e => e.EventId == id);

                if (evaluationForm == null) return NotFound("Evaluation form not found");

                // Create a response object that includes categories and their questions
                var response = new
                {
                    Id = evaluationForm.Id,
                    EventId = evaluationForm.EventId,
                    Title = evaluationForm.Title,
                    Description = evaluationForm.Description,
                    Categories = evaluationForm.EvaluationCategories.Select(category => new
                    {
                        Id = category.Id,
                        Name = category.Name,
                        Questions = category.Questions.Select(q => new EvaluationQuestionDto
                        {
                            Id = q.Id,
                            QuestionText = q.QuestionText
                        }).ToList()
                    }).ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("submit-evaluation")]
        public async Task<IActionResult> SubmitEvaluation([FromBody] List<EvaluationAnswersDto> submissions)
        {
            try 
            {
                if (submissions == null || !submissions.Any())
                    return BadRequest("No evaluation submissions provided");

                var evaluationSubmissions = submissions.Select(submission => new EvaluationAnswer
                {
                    AttendeeId = submission.AttendeeId,
                    EvaluationFormId = submission.EvaluationFormId,
                    QuestionId = submission.QuestionId,
                    Answer = submission.Answer,
                    CreatedAt = DateTime.Now,
                }).ToList();

                _context.EvaluationAnswers.AddRange(evaluationSubmissions);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Evaluation submitted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{id}/delete-form")]
        public async Task<IActionResult> DeleteEvaluationForm(int id)
        {
            var evaluationForm = await _context.EvaluationForms
                .FirstOrDefaultAsync(e => e.Id == id);

            if (evaluationForm == null) return NotFound("Evaluation form not found");

            _context.EvaluationForms.Remove(evaluationForm);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}