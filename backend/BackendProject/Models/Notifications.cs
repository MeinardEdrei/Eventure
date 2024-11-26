using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
  [Table("notifications")]
  public class Notification
  {
    [Key]
    public int Id { get; set; }

    [Required]
    [Column("UserId")]
    [ForeignKey("User")]
    public required int UserId { get; set; }

    [Required]
    [Column("EventId")]
    [ForeignKey("Event")]
    public required int EventId { get; set; }

    [Required]
    [Column("Type")]
    public required string Type { get; set; } = string.Empty;


    // Eager Loading Navigatiion Props
    public User? User { get; set; }
    public Event? Event { get; set; }
  }
}