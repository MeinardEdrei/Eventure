using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
  [Table("school_year")]
  public class SchoolYear
  {
    [Key]
    public int Id { get; set; }
    public required DateTime DateStart { get; set; }
    public required DateTime DateEnd { get; set; }
    public required bool IsArchived { get; set; }
  }
}