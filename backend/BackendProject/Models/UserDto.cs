namespace BackendProject.Models
{
    public class UserDto
    {
        public string Username { get; set; } = string.Empty; // Default value
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Profile_Image { get; set; } = string.Empty;
        public int Attended_Events { get; set; }
        public int Created_Events { get; set; }
    }
}