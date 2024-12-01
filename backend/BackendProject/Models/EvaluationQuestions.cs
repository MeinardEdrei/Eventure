using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
  [Table("evaluation_question")]
  public class EvaluationQuestion
  {
    [Key]
    public int Id { get; set; }

    [Column("EvaluationFormId")]
    public int EvaluationFormId { get; set; }

    [Column("Category")]
    public string? Category { get; set; } 

    [Column("Question")]
    public string? Question { get; set; } 

     // NAVIGATION PROPERTIES
    [ForeignKey("EvaluationFormId")]
    public EvaluationForm? EvaluationForm { get; set; } 
  }
}