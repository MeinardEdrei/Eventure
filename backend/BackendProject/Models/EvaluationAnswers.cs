using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
  [Table("evaluation_answer")]
  public class EvaluationAnswer
  {
    [Key]
    public int Id { get; set; }

    [Column("AttendeeId")]
    public int AttendeeId { get; set; }

    [Column("EvaluationFormId")]
    public int EvaluationFormId { get; set; }

    [Column("QuestionId")]
    public int QuestionId { get; set; }

    [Column("Answer")]
    public string? Answer { get; set; }

    [Column("CreatedAt")]
    public DateTime CreatedAt { get; set; }

    // NAVIGATION PROPERTIES
    [ForeignKey("EvaluationFormId")]
    public EvaluationForm? EvaluationForm { get; set; }

    [ForeignKey("AttendeeId")]
    public User User { get; set; } = null!;

    [ForeignKey("QuestionId")]
    public EvaluationQuestion? EvaluationQuestion { get; set; }
  }
}