using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public required string Email { get; set; }

        [Required]
        [StringLength(50)]
        public required string Username { get; set; }

        [Required]
        [StringLength(255)]
        public required string Password { get; set; }

        [Required]
        [StringLength(20)]
        public string Role { get; set; } = "attendee"; // Default Role until Approval

        [Required]
        [StringLength(10)]
        public string Status { get; set; } = "pending"; // Default Status until Approval
    }
}
