using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;


namespace BackendProject.Models
{
    public class EventsDto
    {
        [Required]
        public string CampusType { get; set; } = string.Empty;

        [Required]
        public string EventType { get; set; } = string.Empty;

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime DateStart { get; set; }

        [Required]
        public DateTime DateEnd { get; set; }

        [Required]
        public TimeSpan TimeStart { get; set; }

        [Required]
        public TimeSpan TimeEnd { get; set; }

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public int MaxCapacity { get; set; }

        [Required]
        public required string HostedBy { get; set; } = string.Empty;

        [Required]
        public required string Visibility { get; set; } = string.Empty;

        [Required]
        public required bool RequireApproval { get; set; }

        [Required]
        public required string Partnerships { get; set; }

        public IFormFile? EventImage { get; set; }

        [Required]
        public int OrganizerId { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty;

        [Required]
        public int AttendeesCount { get; set; }

        public string? RequirementFiles { get; set;} = null;
    }
}
