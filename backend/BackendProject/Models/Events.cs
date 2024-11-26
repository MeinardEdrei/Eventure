using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
    [Table("events")]
    public class Event
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public required string Title { get; set; }

        [Required]
        [StringLength(255)]
        public required string Description { get; set; }

        [Required]
        public required DateTime Date { get; set; }

        [Required]
        public required TimeSpan Start { get; set; }

        [Required]
        public required TimeSpan End { get; set; }

        [Required]
        [StringLength(255)]
        public required string Location { get; set; }

        [Required]
        public required int Max_Capacity { get; set; }

        [Required]
        public required string Hosted_By { get; set; }

        [Required]
        public required string Visibility { get; set; }

        [Required]
        public required bool Require_Approval { get; set; }

        [Required]
        public required bool Require_Ticket { get; set; }
        
        [Required]
        [StringLength(255)]
        public required string Event_Image { get; set; }

        [Required]
        public required DateTime Created_At { get; set; }

        [Required]
        public required int Organizer_Id { get; set; }

        [Required]
        public required string Status { get; set; }

        [Required]
        public required int Attendees_Count { get; set; }


        // Eager Loading Navigatiion Props
        public ICollection<UEvent> UserEvents { get; set; } = new List<UEvent>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}
