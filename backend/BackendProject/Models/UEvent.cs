using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models
{
    [Table("user_events")]
    public class UEvent
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required int User_Id { get; set; }

        [Required]
        public required int Event_Id { get; set; }

        [Required]
        public required string Status { get; set; } = string.Empty;
    }
}

