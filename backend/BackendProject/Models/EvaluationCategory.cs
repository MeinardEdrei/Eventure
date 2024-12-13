using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
    [Table("evaluation_category")]
    public class EvaluationCategory
    {
        [Key]
        public int Id { get; set; }

        [Column("EvaluationFormId")]
        public int EvaluationFormId { get; set; }

        [Column("Name")]
        public string? Name { get; set; }

        // NAVIGATION PROPERTIES
        [ForeignKey("EvaluationFormId")]
        public EvaluationForm? EvaluationForm { get; set; }
        public ICollection<EvaluationQuestion>? Questions { get; set; }
    }
}