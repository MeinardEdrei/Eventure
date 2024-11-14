using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendProject.Models;
using BackendProject.Data;
using BCrypt.Net;
using System.IO; // File Manipulation

//Google Sheets
using System.Net.Http;
using System.Text.Json;

namespace BackendProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly IWebHostEnvironment _hostingEnvironment;

        public EventController(ApplicationDbContext context,
            IWebHostEnvironment hostingEnvironment) {

            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

    // ----------------POST api/event/create------------------- 
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
    }
}