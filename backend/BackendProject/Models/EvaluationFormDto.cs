namespace BackendProject.Models
{
  public class EvaluationFormDto
  {
    public int Id { get; set; }
    public int EventId { get; set; }
    public int OrganizerId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Categories { get; set; } 
    public string? Questions { get; set; } 
    public DateTime CreatedAt { get; set; }
  }
}