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
    public required string Type { get; set; }

    [Column("NotificationImage")]
    public required string NotificationImage { get; set; }

    [Column("Message")]
    public required string Message { get; set; }

    [Column("Status")]
    public required string Status { get; set; }

    [Column("CreatedAt")]
    public DateTime? CreatedAt { get; set; }


    // Eager Loading Navigatiion Props
    public User? User { get; set; }
    public Event? Event { get; set; }
  }
}