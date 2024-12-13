namespace BackendProject.Models
{
  public class EvaluationCategoryDto
  {
      public int Id { get; set; }
      public string? Name { get; set; }
      public List<EvaluationQuestionDto>? Questions { get; set; }
  }
}