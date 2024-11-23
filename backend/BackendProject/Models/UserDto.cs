namespace BackendProject.Models
{
    public class UserDto
    {
        public string Username { get; set; } = string.Empty; 
        public string Email { get; set; } = string.Empty;
        public string Student_Number { get; set; } = string.Empty;
        public string Section { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Profile_Image { get; set; } = string.Empty;
        public int Attended_Events { get; set; }
        public int Created_Events { get; set; }
        public DateTime Created_At { get; set; }
    }
}