using System.Reflection.Metadata;

namespace BackendProject.Models
{
    public class RFormDto
    {
        public int User_Id { get; set; } 
        public int Event_Id { get; set; } 
        public string Event_Title { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string  School_Id { get; set; } = string.Empty;
        public string Section { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public required byte[]? Ticket { get; set; }
        public DateTime Registered_Time { get; set; }
    }
}