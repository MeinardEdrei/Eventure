namespace BackendProject.Models
{
  public class EvaluationQuestionDto
  {
    public int Id { get; set; }
    public int EvaluationFormId { get; set; }
    public string? Category { get; set; } 
    public string? Question { get; set; } 
  }
}