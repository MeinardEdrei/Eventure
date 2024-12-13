using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
  [Table("evaluation_question")]
  public class EvaluationQuestion
  {
    [Key]
    public int Id { get; set; }

    [Column("EvaluationCategoryId")]
    public int EvaluationCategoryId { get; set; }

    [Column("QuestionText")]
    public string? QuestionText { get; set; }

    // NAVIGATION PROPERTIES
    [ForeignKey("EvaluationCategoryId")]
    public EvaluationCategory? EvaluationCategory { get; set; }
  }
}