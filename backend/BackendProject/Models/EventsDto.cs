using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;


namespace BackendProject.Models
{
    public class EventsDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public TimeSpan Start { get; set; }

        [Required]
        public TimeSpan End { get; set; }

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public int Max_Capacity { get; set; }

        [Required]
        public required string Hosted_By { get; set; } = string.Empty;

        [Required]
        public required string Visibility { get; set; } = string.Empty;

        [Required]
        public required bool Require_Approval { get; set; }

        [Required]
        public required bool Require_Ticket { get; set; }

        [Required]
        public required IFormFile Event_Image { get; set; }

        [Required]
        public int Organizer_Id { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty;

        [Required]
        public int Attendees_Count { get; set; }
    }
}
