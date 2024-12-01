using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
  [Table("evaluation_form")]
  public class EvaluationForm
  {
    [Key]
    public int Id { get; set; }

    [Column("EventId")]
    public int EventId { get; set; }

    [Column("OrganizerId")]
    public int OrganizerId { get; set; }

    [Column("Title")]
    public string? Title { get; set; }

    [Column("Description")]
    public string? Description { get; set; }

    [Column("CreatedAt")]
    public DateTime CreatedAt { get; set; }


    // NAVIGATION PROPERTIES
    [ForeignKey("EventId")]
    public Event? Event { get; set; }
  }
}