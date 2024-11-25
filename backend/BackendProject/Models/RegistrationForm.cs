using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
    [Table("registration_form")]
    public class RForm
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required int User_Id { get; set; }

        [Required]
        public required int Event_Id { get; set; }

        [Required]
        public required string Event_Title { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        [StringLength(100)]
        public required string Email { get; set; }

        [Required]
        [StringLength(50)]
        public required string School_Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string Section { get; set; }

        [Required]
        public required string Status { get; set; }

        [Required]
        public required DateTime Registered_Time { get; set; }
    }
}
