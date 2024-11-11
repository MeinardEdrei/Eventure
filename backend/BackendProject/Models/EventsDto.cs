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
        public string Date { get; set; } = string.Empty;

        [Required]
        public string Start { get; set; } = string.Empty;

        [Required]
        public string End { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public int Max_Capacity { get; set; }

        [Required]
        public required IFormFile Event_Image { get; set; }

        [Required]
        public string Created_At { get; set; } = string.Empty;

        [Required]
        public int Organizer_Id { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty;

        [Required]
        public int Attendees_Count { get; set; }
    }
}
