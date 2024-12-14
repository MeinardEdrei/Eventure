using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;

namespace BackendProject.Models
{
    [Table("registration_form")]
    public class RForm
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("User_Id")]
        public required int User_Id { get; set; }

        [Required]
        [Column("Event_Id")]
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
        public required string Ticket { get; set; }

        [Required]
        public required DateTime Registered_Time { get; set; }

        //NAVIGATION PROPERTIES
        [ForeignKey("Event_Id")]
        public Event? Event { get; set; }

        public ICollection<UEvent> UEvents { get; set; } = new List<UEvent>();
    }
}
