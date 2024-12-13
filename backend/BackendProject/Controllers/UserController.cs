using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendProject.Models;
using BackendProject.Data;
using BCrypt.Net;

namespace BackendProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context; // database holder
        private readonly IConfiguration _configuration; // for JWT configurations
        private readonly EmailServicePassword _emailServicePassword;

        public UserController(ApplicationDbContext context, IConfiguration configuration,
        EmailServicePassword emailServicePassword)
        {
            _context = context;
            _configuration = configuration;
            _emailServicePassword = emailServicePassword;
        }

        // ----------------POST api/user/register------------------- 
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto userDto)
        {
            if (userDto == null || string.IsNullOrEmpty(userDto.Email) || string.IsNullOrEmpty(userDto.Username) || string.IsNullOrEmpty(userDto.Student_Number) || string.IsNullOrEmpty(userDto.Department) || string.IsNullOrEmpty(userDto.Password))
            {
                return BadRequest(new { message = "All fields are required." });
            }

            // Check if email already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email is already in use." });
            }

            // Create new user and hash the password
            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                Student_Number = userDto.Student_Number,
                Section = userDto.Section,
                Department = userDto.Department,
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                Role = userDto.Role,
                Status = userDto.Status,
                Profile_Image = userDto.Profile_Image,
                Attended_Events = userDto.Attended_Events,
                Created_Events = userDto.Created_Events,
                Created_At = DateTime.Now,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully." });
        }

        // ----------------POST api/user/login------------------- 
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest(new { message = "Email and Password are required." }); // 400
            }

            // Find user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return NotFound(new { message = "Invalid email." }); // 404

            }
            else if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid password." }); // 401
            }

            return Ok(new
            {
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    student_number = user.Student_Number,
                    section = user.Section,
                    department = user.Department,
                    attended_events = user.Attended_Events,
                    created_events = user.Created_Events,
                    role = user.Role
                }
            });
        }

        [HttpGet("userAttendedEvents/{id}")]
        public async Task<IActionResult> GetAttendedEvents(int id)
        {
            var attendedEvents = await _context.UEvents
                .Where(ue => ue.User_Id == id)
                .Include(u => u.Event)
                .Select(ue => ue.Event)
                .ToListAsync();

            return Ok(attendedEvents);
        }

        [HttpGet("userCreatedEvents/{id}")]
        public async Task<IActionResult> GetCreatedEvents(int id)
        {
            var createdEvents = await _context.Events
                .Where(e => e.OrganizerId == id)
                .ToListAsync();

            return Ok(createdEvents);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers() 
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpPost("admin-register")]
        public async Task<IActionResult> AdminRegister([FromBody] UserDto userDto)
        {
            // Check if email already exists
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email is already in use." });
            }

            // Create new user and hash the password
            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                Student_Number = userDto.Student_Number,
                Section = userDto.Section,
                Department = userDto.Department,
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                Role = userDto.Role,
                Status = userDto.Status,
                Profile_Image = userDto.Profile_Image,
                Attended_Events = userDto.Attended_Events,
                Created_Events = userDto.Created_Events,
                Created_At = DateTime.Now,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully." });
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetUserCount()
        {
            try
            {
                int userCount = await _context.Users.CountAsync();
                return Ok(new { count = userCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateUser([FromBody] UserDto userDto, int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) {
                return NotFound(new { message = "User not found." });
            }

            // Update user properties
            user.Email = userDto.Email ?? user.Email;
            user.Role = userDto.Role ?? user.Role;
            user.Student_Number = userDto.Student_Number ?? user.Student_Number;
            user.Section = userDto.Section ?? user.Section;
            user.Department = userDto.Department ?? user.Department;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User updated successfully." });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) {
                return NotFound(new { message = "User not found." });
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "User deleted successfully." });
        }

        [HttpGet("{id}/get-user")]
        public async Task<ActionResult<Event>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            return Ok(user);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string Email)
        {
            if (string.IsNullOrEmpty(Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == Email);
            if (user == null)
            {
                return NotFound(new { message = "User  not found." });
            }

            // Generate a password reset code
            var resetCode = Guid.NewGuid().ToString();
            user.PasswordResetCode = resetCode;
            user.PasswordResetCodeExpiration = DateTime.Now.AddHours(1); // Set expiration time (e.g., 1 hour)

            await _context.SaveChangesAsync();

            // Send email with the reset code
            var emailSubject = "Password Reset Request";
            var emailBody = "Your password reset code is: " + resetCode;
            var emailResult = _emailServicePassword.sendEmail(Email, emailSubject, resetCode, user.Username);

            if (emailResult.Contains("Error"))
            {
                return StatusCode(500, new { message = "Error sending email." });
            }

            return Ok(new { message = "Password reset code has been sent to your email." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.PasswordResetCode == resetPasswordDto.Code);
            if (user == null || user.PasswordResetCodeExpiration < DateTime.Now)
            {
                return BadRequest(new { message = "Invalid or expired reset code." });
            }

            // Update the user's password
            user.Password = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            user.PasswordResetCode = null; // Clear the reset code
            user.PasswordResetCodeExpiration = null; // Clear the expiration time

            await _context.SaveChangesAsync();

            return Ok(new { message = "Password has been reset successfully." });
        }

        [HttpPost("{id}/update-profile")]
        public async Task<IActionResult> UpdateProfile(int id, [FromForm] UpdateProfileDto updateDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            // Username validation
            if (!string.IsNullOrEmpty(updateDto.Username))
            {
                if (updateDto.Username.Length < 3)
                {
                    return BadRequest(new { message = "Username must be at least 3 characters long." });
                }

                var existingUsername = await _context.Users.AnyAsync(u => 
                    u.Username == updateDto.Username && u.Id != id);
                
                if (existingUsername)
                {
                    return BadRequest(new { message = "Username is already taken." });
                }

                user.Username = updateDto.Username;
            }

            // Optional: Make profile image update optional
            if (updateDto.ProfileImage != null && updateDto.ProfileImage.Length > 0)
            {
                try
                {
                    var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                    
                    if (!Directory.Exists(uploadDir))
                    {
                        Directory.CreateDirectory(uploadDir);
                    }

                    var fileName = $"{Guid.NewGuid()}_{updateDto.ProfileImage.FileName}";
                    var filePath = Path.Combine(uploadDir, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await updateDto.ProfileImage.CopyToAsync(stream);
                    }

                    user.Profile_Image = fileName;
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error uploading image", error = ex.Message });
                }
            }

            try
            {
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    message = "Profile updated successfully", 
                    profile_Image = user.Profile_Image,
                    username = user.Username
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating profile", error = ex.Message });
            }
        }
    }
}
