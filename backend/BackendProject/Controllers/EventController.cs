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
            IWebHostEnvironment hostingEnvironment)
        {

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

            // Validate file type
            var allowedTypes = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var extension = Path.GetExtension(eventsDto.EventImage.FileName).ToLowerInvariant();
            if (!allowedTypes.Contains(extension))
            {
                return BadRequest(new { message = "Invalid file type. Allowed types: jpg, jpeg, png, gif" });
            }

            // ----------------------END OF VALIDATION--------------------------------

            // ----------------------HANDLE FILE UPLOAD--------------------------------
            var file = eventsDto.EventImage;
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
                AttendeesCount = 0 // Default count
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



        // ----------------------FETCH EVENTS--------------------------------

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

        [HttpPost("approve{eventId}")]
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
                Type = "General",
            };

            _context.Notifications.Add(notifications);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Event approved." });
        }

        [HttpPost("reject{eventId}")]
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

        [HttpGet("organizer-events/{id}")]
        public async Task<IActionResult> GetOrganizerEvents(int id)
        {
            var events = await _context.Events
            .Where(e => e.OrganizerId == id)
            .ToListAsync();

            return Ok(events);
        }

        [HttpGet("{id}/participants")]
        public async Task<IActionResult> GetParticipants(int id)
        {
            var participants = await _context.RForms
                .Where(r => r.Event_Id == id)
                .GroupBy(r => r.Status)
                .Select(g => new {
                    Status = g.Key, // Key used for grouping
                    Name = g.Select(n => n.Name).ToList(),
                    Email = g.Select(m => m.Email).ToList(),
                    Id = g.Select(u => u.User_Id).ToList(),
                    Count = g.Count(),
                })
                .ToListAsync();

            if (participants == null) {
                return NotFound(new { message = "Participants not found." });
            }

            return Ok(participants);
        }

        [HttpPost("{email}/present")]
        public async Task<IActionResult> Present(string email)
        {
            var rForm = await _context.RForms.FirstOrDefaultAsync(r => r.Email == email);
            var rFormBySchoolId = await _context.RForms.FirstOrDefaultAsync(r => r.School_Id == email);

            // Check if the user has already attended
            if (rForm != null && rForm.Status == "Attended") {
                return Conflict(new { message = "User  has already been marked as present." });
            }
            else if (rFormBySchoolId != null && rFormBySchoolId.Status == "Attended") {
                return Conflict(new { message = "User  has already been marked as present." });
            }
            
            if (rForm != null) {
                rForm.Status = "Attended";
                _context.RForms.Update(rForm);
            }
            else if (rFormBySchoolId != null) {
                rFormBySchoolId.Status = "Attended";
            }
            else {
                return NotFound(new { message = "Attendee not found." });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Participant has been marked as present." });
        }

        [HttpPost("{email}/undo-present")]
        public async Task<IActionResult> UndoPresent(string email)
        {
            var rForm = await _context.RForms.FirstOrDefaultAsync(r => r.Email == email);
            if (rForm == null){
                return NotFound(new { message = "RForm not found." });
            }
            rForm.Status = "Going";
            _context.RForms.Update(rForm);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Participant Attendance undone successfully." });
        }

        [HttpPost("{email}/approve-participant")]
        public async Task<IActionResult> ApproveParticipant(string email)
        {
            var rForm = await _context.RForms.FirstOrDefaultAsync(r => r.Email == email);
            if (rForm == null){
                return NotFound(new { message = "RForm not found." });
            }
            rForm.Status = "Going";
            _context.RForms.Update(rForm);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Participant approved successfully." });
        }

        [HttpPost("{email}/disapprove-participant")]
        public async Task<IActionResult> DispproveParticipant(string email)
        {
            var rForm = await _context.RForms.FirstOrDefaultAsync(r => r.Email == email);
            if (rForm == null){
                return NotFound(new { message = "RForm not found." });
            }
            rForm.Status = "Disapproved";
            _context.RForms.Update(rForm);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Participant has been disapproved." });
        }

        [HttpGet("{email}/ticket")]
        public async Task<IActionResult> GetTicket(string email)
        {
            var ticketDetails = await _context.RForms
                .Where(e => e.Email == email)
                .Select(r => new 
                {
                    // RForm details
                    RegistrationId = r.Id,
                    UserId = r.User_Id,
                    Name = r.Name,
                    Email = r.Email,
                    SchoolId = r.School_Id,
                    Section = r.Section,
                    Status = r.Status,
                    Ticket = r.Ticket,
                    RegisteredTime = r.Registered_Time,

                    // Related Event details
                    EventId = r.Event.Id,
                    EventTitle = r.Event.Title,
                    EventDescription = r.Event.Description,
                    EventDateStart = r.Event.DateStart,
                    EventDateEnd = r.Event.DateEnd,
                    EventTimeStart = r.Event.TimeStart,
                    EventTimeEnd = r.Event.TimeEnd,
                    EventLocation = r.Event.Location,
                    EventImage = r.Event.EventImage
                })
                .FirstOrDefaultAsync();

            if (ticketDetails == null) 
            {
                return NotFound(new { message = "Ticket not found." });
            }

            return Ok(ticketDetails);
        }
    }
}