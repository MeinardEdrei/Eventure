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
        public required string Student_Number { get; set; }

        [Required]
        public required string Section { get; set; }

        [Required]
        public required string Department { get; set; }

        [Required]
        [StringLength(100)]
        public required string Username { get; set; }

        [Required]
        [StringLength(255)]
        public required string Password { get; set; }

        [Required]
        [StringLength(20)]
        public required string Role { get; set; }

        [Required]
        [StringLength(10)]
        public required string Status { get; set; }

        [Required]
        [StringLength(255)]
        public required string Profile_Image { get; set; }

        [Required]
        public required int Attended_Events { get; set; }
        
        [Required]
        public required int Created_Events { get; set; }

        public required DateTime Created_At { get; set; }


        // Eager Loading Navigatiion Props
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}
