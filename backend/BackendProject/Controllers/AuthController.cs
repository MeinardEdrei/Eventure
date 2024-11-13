using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendProject.Models;
using BackendProject.Data;
using BCrypt.Net;
using System.IO; // File Manipulation

//JWT using
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;


namespace BackendProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context; // database holder
        private readonly IConfiguration _configuration; // for JWT configurations
        private readonly IWebHostEnvironment _hostingEnvironment; // IWebHostEnvironment to handle file uploads

        public AuthController(ApplicationDbContext context, IConfiguration configuration, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _configuration = configuration;
            _hostingEnvironment = hostingEnvironment; 
        }

        // ----------------POST api/auth/register------------------- 
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto userDto)
        {
            if (userDto == null || string.IsNullOrEmpty(userDto.Email) || string.IsNullOrEmpty(userDto.Username) || string.IsNullOrEmpty(userDto.Password))
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
                Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                Role = userDto.Status, 
                Status = "Pending",  // Default status
                Profile_Image = userDto.Profile_Image,
                Attended_Events = userDto.Attended_Events,
                Created_Events = userDto.Created_Events
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
                return BadRequest(new { message = "Email and password are required." });
            }

            // Find user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid email or password." });
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
            {
                return BadRequest(new { message = "Invalid email or password." });
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);

            return Ok(new { 
                token = token,
                user = new { 
                    id = user.Id,
                    username = user.Username,
                    email = user.Email,
                    role = user.Role
                }
            });
        }

        // ----------------POST api/auth/create------------------- 
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] EventsDto eventsDto)
        {
            // ----------------------VALIDATION--------------------------------
            if (string.IsNullOrEmpty(eventsDto.Title) ||
                string.IsNullOrEmpty(eventsDto.Description) ||
                string.IsNullOrEmpty(eventsDto.Location) ||
                eventsDto.Organizer_Id <= 0)
            {
                return BadRequest(new { message = "All fields are required." });
            }

            if (eventsDto == null) {
                return BadRequest(new { message = "All fields are required." });
            }

            if (eventsDto.Event_Image == null || eventsDto.Event_Image.Length == 0)
            {
                return BadRequest(new { message = "Event image is required." });
            }

            // Validate file type
            var allowedTypes = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(eventsDto.Event_Image.FileName).ToLowerInvariant();
            if (!allowedTypes.Contains(extension))
            {
                return BadRequest(new { message = "Invalid file type. Allowed types: jpg, jpeg, png, gif" });
            }

            // ----------------------END OF VALIDATION--------------------------------

            // ----------------------HANDLE FILE UPLOAD--------------------------------
            var file = eventsDto.Event_Image;
            string fileName = null;

            if (file != null && file.Length > 0)
            {
                fileName = file.FileName; // Store the filename

                // Define the uploads folder path
                var uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, "uploads");

                // Create directory if it doesn't exist
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                var filePath = Path.Combine(uploadPath, fileName);

                // Save the file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
            }
            // ----------------------END OF HANDLE FILE UPLOAD-------------------------------- 

            // ----------------------CREATE NEW EVENT--------------------------------
            var newEvent = new Event
            {
                Title = eventsDto.Title,
                Description = eventsDto.Description,
                Date = eventsDto.Date,
                Start = eventsDto.Start,
                End = eventsDto.End,
                Location = eventsDto.Location,
                Max_Capacity = eventsDto.Max_Capacity,
                Event_Image = fileName,
                Created_At = DateTime.Now, 
                Organizer_Id = eventsDto.Organizer_Id,
                Status = eventsDto.Status, // Default to "Pending"
                Attendees_Count = 0 // Default count
            };

            _context.Events.Add(newEvent); // Save to database
            await _context.SaveChangesAsync();

            // ----------------------INCREMENT CREATED_EVENTS FOR ORGANIZER--------------------------------
            var organizer = await _context.Users.FindAsync(eventsDto.Organizer_Id);
            if (organizer != null)
            {   
                organizer.Created_Events += 1; // Increment the count
                _context.Users.Update(organizer); // Mark the user as modified
                await _context.SaveChangesAsync(); // Save changes to the database
            }
            // ----------------------END OF INCREMENT-------------------------------- 

            return Ok(new { message = "Event created successfully." });
        }



        // ----------------------FETCH EVENTS--------------------------------

        [HttpGet("events")]
        public async Task<IActionResult> GetEvents()
        {
            var events = await _context.Events.ToListAsync();

            // Check if there are any events
            if (events == null || events.Count == 0)
            {
                return NotFound(new { message = "No events found." });
            }

            // Return the list of events as a JSON response
            return Ok(events);
        }

        [HttpGet("events{id}")]
        public async Task<IActionResult> GetEvent(int id)
        {
            var @event = await _context.Events.FindAsync(id);

            if (@event == null)
            {
                return NotFound(new { message = $"Event with ID {id} not found." });
            }
            return Ok(@event);
        }

        [HttpGet("uploads/{filename}")]
        public IActionResult GetImage(string filename)
        {
            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "uploads", filename);
            
            if (System.IO.File.Exists(filePath))
            {
                byte[] imageBytes = System.IO.File.ReadAllBytes(filePath);
                return File(imageBytes, "image/jpeg");
            }
            else
            {
                return NotFound();
            }
        }

        // ----------------------END OF FETCH EVENTS--------------------------------

        // ----------------------REGISTRATION FORM--------------------------------
        [HttpPost("join")]
        public async Task<IActionResult> JoinEvent([FromForm] RFormDto rformDto)
        {
            
            if (rformDto == null) {
                return BadRequest(new { message = "All fields are required." });
            }
            
            var eventToJoin = await _context.Events.FindAsync(rformDto.Event_Id);
            if (eventToJoin == null){
                return NotFound(new { message = "No Event Found" });
            }

            if (eventToJoin.Attendees_Count > eventToJoin.Max_Capacity) {
                return BadRequest(new { message = "Event is full. Cannot join." });
            }

            var attendee = new RForm
            {
                User_Id = rformDto.User_Id,
                Event_Id = rformDto.Event_Id,
                Name = rformDto.Name,
                Email = rformDto.Email, 
                School_Id = rformDto.School_Id,  
                Section = rformDto.Section,
                Status = "Joined"
            };

            _context.RForms.Add(attendee);
            await _context.SaveChangesAsync();

            // +1 to Attendees
            eventToJoin.Attendees_Count += 1; 
            _context.Events.Update(eventToJoin); 
            await _context.SaveChangesAsync(); 

            // Insert to user_events
            var userEvent = new UEvent
            {
                User_Id = rformDto.User_Id,
                Event_Id = rformDto.Event_Id,
                Status = "Joined"
            };
            _context.UEvents.Add(userEvent);
            await _context.SaveChangesAsync(); 

            return Ok(new { message = "Joined the Event Successfully." });
        }

        private string GenerateJwtToken(User user) // JWT for Session
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim("id", user.Id.ToString()),
                new Claim("role", user.Role),
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
