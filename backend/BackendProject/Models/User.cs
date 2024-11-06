using System.ComponentModel.DataAnnotations;

namespace BackendProject.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        [StringLength(255)]
        public string Password { get; set; }

        [Required]
        [StringLength(20)]
        public string Role { get; set; } = "attendee"; // Default Role until Approval

        [Required]
        [StringLength(10)]
        public string Status { get; set; } = "pending"; // Default Status until Approval
    }
}
