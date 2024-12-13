using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
  [Table("rejection_reason")]
  public class RejectionReason
  {
    [Key]
    public int Id { get; set; }
    public int Event_Id { get; set; }
    public string? Reason { get; set; }
    public DateTime CreatedAt { get; set; }

    [ForeignKey("Event_Id")]
    public Event? Event { get; set; }
  }
}