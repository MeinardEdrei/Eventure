namespace BackendProject.Models 
{
  public class EvaluationFormDto
  {
    public int Id { get; set; }
    public int EventId { get; set; }
    public int OrganizerId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public List<EvaluationCategoryDto>? Categories { get; set; }
    public DateTime CreatedAt { get; set; }
  }
}