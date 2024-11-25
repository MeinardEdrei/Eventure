using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;


namespace BackendProject.Models
{
    public class ueventsDto
    {
        [Required]
        public required int UserId { get; set; }

        [Required]
        public required int EventId { get; set; }

        [Required]
        public required string Status { get; set; } = string.Empty;
    }
}
