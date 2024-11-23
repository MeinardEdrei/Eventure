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

        public UserController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ----------------POST api/auth/register------------------- 
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

        // ----------------POST api/auth/login------------------- 
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

        [HttpGet("userEvents/{id}")]
        public async Task<IActionResult> GetEvents(int id)
        {
            var attendedEvents = await _context.UEvents
                .Where(ue => ue.User_Id == id)
                .Include(u => u.Event)
                .Select(ue => ue.Event)
                .ToListAsync();

            if (attendedEvents == null || !attendedEvents.Any())
            {
                return NotFound(new { message = "No events found for this user." });
            }

            return Ok(attendedEvents);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers() 
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }
    }
}
