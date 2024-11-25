using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
    [Table("user_events")]
    public class UEvent
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("UserId")]
        public required int UserId { get; set; }

        [Required]
        [Column("EventId")]
        [ForeignKey("Event")]
        public required int EventId { get; set; }

        [Required]
        [Column("Status")]
        public required string Status { get; set; } = string.Empty;


        // Eager Loading Navigatiion Props
        public User? User { get; set; }
        public Event? Event { get; set; }
    }
}

