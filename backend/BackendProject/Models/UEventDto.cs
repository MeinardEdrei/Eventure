using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;


namespace BackendProject.Models
{
    public class ueventsDto
    {
        [Required]
        public required int User_Id { get; set; }

        [Required]
        public required int Event_Id { get; set; }

        [Required]
        public required string Status { get; set; } = string.Empty;
    }
}
