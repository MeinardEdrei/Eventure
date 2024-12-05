using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using BackendProject.Models;
using BackendProject.Data;

using BCrypt.Net;
using System.IO; // File Manipulation

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
            IWebHostEnvironment hostingEnvironment)
        {

            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost("update-status")]
        public async Task<IActionResult> UpdateStatus()
        {
            var events = await _context.Events
            .Where(e => e.Status == "Approved" && e.DateStart > DateTime.Now)
            .ToListAsync();

            if (events.Count == 0) return NoContent();

            foreach (var eventItem in events)
            {
                eventItem.Status = "Ended"; 
            }
            
            await _context.SaveChangesAsync();
            return Ok(new {message = "Status updated" });
        }

        // ----------------POST api/event/create------------------- 
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] EventsDto eventsDto)
        {
            // ----------------------VALIDATION--------------------------------
            if (string.IsNullOrEmpty(eventsDto.Title) ||
                string.IsNullOrEmpty(eventsDto.Description) ||
                string.IsNullOrEmpty(eventsDto.Location) ||
                eventsDto.OrganizerId <= 0)
            {
                return BadRequest(new { message = "All fields are required." });
            }

            if (eventsDto == null)
            {
                return BadRequest(new { message = "All fields are required." });
            }

            if (eventsDto.EventImage == null || eventsDto.EventImage.Length == 0)
            {
                return BadRequest(new { message = "Event image is required." });
            }

            // ----------------------END OF VALIDATION--------------------------------

            // ----------------------HANDLE FILE UPLOAD--------------------------------
            var file = eventsDto.EventImage;
            string fileName = null!;

            if (file != null && file.Length > 0)
            {
                fileName = file.FileName; // Store the filename

                // Define the uploads folder path
                // var uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, $"{eventsDto.DateStart.ToString("MMMM dd, yyyy h-mm tt")} Event Uploads");
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
                CampusType = eventsDto.CampusType,
                EventType = eventsDto.EventType,
                Title = eventsDto.Title,
                Description = eventsDto.Description,
                DateStart = eventsDto.DateStart,
                DateEnd = eventsDto.DateEnd,
                TimeStart = eventsDto.TimeStart,
                TimeEnd = eventsDto.TimeEnd,
                Location = eventsDto.Location,
                MaxCapacity = eventsDto.MaxCapacity,
                HostedBy = eventsDto.HostedBy,
                Visibility = eventsDto.Visibility,
                RequireApproval = eventsDto.RequireApproval,
                Partnerships = eventsDto.Partnerships,
                EventImage = fileName,
                CreatedAt = DateTime.Now,
                OrganizerId = eventsDto.OrganizerId,
                Status = eventsDto.Status, // Default to "Pending"
                AttendeesCount = 0, // Default count
                RequirementFiles = eventsDto.RequirementFiles ?? string.Empty,
            };

            _context.Events.Add(newEvent); // Save to database
            await _context.SaveChangesAsync();

            // ----------------------INCREMENT CREATED_EVENTS FOR ORGANIZER--------------------------------
            var organizer = await _context.Users.FindAsync(eventsDto.OrganizerId);
            if (organizer != null)
            {
                organizer.Created_Events += 1; // Increment the count
                _context.Users.Update(organizer); // Mark the user as modified
                await _context.SaveChangesAsync(); // Save changes to the database
            }
            // ----------------------END OF INCREMENT-------------------------------- 

            return Ok(new { message = "Event created successfully." });
        }



        [HttpGet("events")]
        public async Task<IActionResult> GetEvents()
        {
            var events = await _context.Events
                .Where(e => e.Status == "Approved")
                .ToListAsync();

            // Check if there are any events
            if (events == null || events.Count == 0)
            {
                return NotFound(new { message = "No events found." });
            }

            // Return the list of events as a JSON response
            return Ok(events);
        }

        [HttpDelete("{id}/cancel-event")]
        public async Task<IActionResult> CancelEvent(int id)
        {
            var eventToCancel = await _context.Events.FindAsync(id);
            if (eventToCancel == null) return NotFound(new { message = "Event not found." });

            _context.Events.Remove(eventToCancel);
            await _context.SaveChangesAsync();

            // var uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, $"{eventToCancel.DateStart} Event Uploads");
            // Directory.Delete(uploadPath, true);

            return Ok(new { message = "Event cancelled successfully." });
        }

        [HttpGet("event-approval")]
        public async Task<IActionResult> GetAdminEvents()
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

        [HttpPost("{eventId}/approve")]
        public async Task<IActionResult> ApproveEvent(int eventId)
        {
            var eventToApprove = await _context.Events.FindAsync(eventId);

            if (eventToApprove == null)
            {
                return NotFound(new { message = "Event not found." });
            }

            eventToApprove.Status = "Approved";

            var notifications = new Notification
            {
                UserId = eventToApprove.OrganizerId,
                EventId = eventToApprove.Id,
                Message = "Your event has been approved.",
                Type = "All",
                CreatedAt = DateTime.Now,
            };

            _context.Notifications.Add(notifications);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Event approved." });
        }

        [HttpPost("{eventId}/pre-approve")]
        public async Task<IActionResult> PreApproveEvent(int eventId)
        {
            var eventToApprove = await _context.Events.FindAsync(eventId);

            if (eventToApprove == null)
            {
                return NotFound(new { message = "Event not found." });
            }

            eventToApprove.Status = "Pre-Approved";

            var notifications = new Notification
            {
                UserId = eventToApprove.OrganizerId,
                EventId = eventToApprove.Id,
                Type = "Organizer",
            };

            _context.Notifications.Add(notifications);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Event approved." });
        }

        [HttpPost("{eventId}/reject")]
        public async Task<IActionResult> RejectEvent(int eventId)
        {
            var eventToReject = await _context.Events.FindAsync(eventId);

            if (eventToReject == null)
            {
                return NotFound(new { message = "Event not found." });
            }

            eventToReject.Status = "Rejected";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Event Rejected." });
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

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { Message = "Image not found." });
            }

            var contentType = "image/jpeg"; 
            return PhysicalFile(filePath, contentType);
        }

        [HttpGet("notification")]
        public async Task<IActionResult> GetNotification()
        {
            var notifications = await _context.Notifications
                .Select(n => new NotificationsDto
                {
                    Id = n.Id,
                    UserId = n.UserId,
                    EventId = n.EventId,
                    Type = n.Type,
                    UserName = n.User.Username,
                    EventTitle = n.Event.Title,
                    EventDesc = n.Event.Description,
                    EventImage = n.Event.EventImage,
                    EventDate = n.Event.DateStart,
                    EventLocation = n.Event.Location,
                })
                .ToListAsync();

            if (notifications == null)
            {
                return NotFound(new { message = "Notifications not found." });
            }

            return Ok(notifications);
        }
    }
}