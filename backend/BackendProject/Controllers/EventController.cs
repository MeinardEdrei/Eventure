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
                .Where(e => e.Status == "Approved" && 
                            (e.DateEnd < DateTime.Now || 
                            (e.DateEnd == DateTime.Now && e.TimeEnd < DateTime.Now.TimeOfDay)))
                .ToListAsync();

            if (events.Count == 0) return NoContent();

            foreach (var eventItem in events)
            {
                eventItem.Status = "Ended"; 
            }
            
            await _context.SaveChangesAsync();
            return Ok(new {message = "Status updated" });
        }

        public async Task<string> DetermineSemester(DateTime EventDateStart, DateTime EventDateEnd)
        {
            var schoolYear = await _context.SchoolYears
                .Where(s => s.IsArchived == false)
                .FirstOrDefaultAsync();

            if (schoolYear == null) return "Unknown";

            DateTime syDateStart = schoolYear.DateStart;
            DateTime syDateEnd = schoolYear.DateEnd;

            // First Semester: Start of the SY - December 15
            if (EventDateStart.Month >= syDateStart.Month && EventDateEnd.Month <= 12)
            {
                // Specifically for Start of the SY, check if it's before the start day
                if (EventDateStart.Month == syDateStart.Month && EventDateStart.Day < syDateStart.Day)
                {
                    return "Second"; // If before start date, it belongs to previous semester
                }
                
                // Specifically for December, check if it's before or on December 15
                if (EventDateStart.Month == 12 && EventDateStart.Day <= 15)
                {
                    return "First";
                }
                
                // For months between start month and December
                if (EventDateStart.Month > syDateStart.Month && EventDateEnd.Month < 12)
                {
                    return "First";
                }
            }
            
            // Second Semester: January 20 - June
            if (EventDateStart.Month >= 1 && EventDateEnd.Month <= syDateEnd.Month)
            {
                // Specifically for January, check if it's before January 20
                if (EventDateStart.Month == 1 && EventDateStart.Day < 20)
                {
                    return "First";
                }
                
                // Specifically for end month, check if it's before or on end day
                if (EventDateEnd.Month == syDateEnd.Month && EventDateEnd.Day <= syDateEnd.Day)
                {
                    return "Second";
                }
                
                // For months between January and end month
                if (EventDateStart.Month >= 1 && EventDateStart.Month < syDateEnd.Month)
                {
                    return "Second";
                }
            }

            return "Unknown";
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

            // SCHOOL YEAR
            DateTime currentDate = DateTime.Now;
            var schoolYear = await _context.SchoolYears
                .FirstOrDefaultAsync(s => currentDate >= s.DateStart && currentDate <= s.DateEnd);
            if (schoolYear == null) throw new Exception("No school year found for the current date.");

            // SEMESTER
            var semesterValue = await DetermineSemester(eventsDto.DateStart, eventsDto.DateEnd);
            
            // NEW EVENT
            var newEvent = new Event
            {
                SchoolYearId = schoolYear.Id,
                Semester = semesterValue,
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

        [HttpPost("{eventId}/pending")]
        public async Task<IActionResult> PendingEvent(int eventId)
        {
            var eventToSubmit = await _context.Events.FindAsync(eventId);
            if (eventToSubmit == null) return NotFound(new { message = "Event not found." } );
            eventToSubmit.Status = "Pending";
            _context.Events.Update(eventToSubmit);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Event submitted successfully." });
        }

        [HttpPost("{eventId}/approve")]
        public async Task<IActionResult> ApproveEvent(int eventId)
        {
            var eventToApprove = await _context.Events.FindAsync(eventId);

            if (eventToApprove == null)
            {
                return NotFound(new { message = "Event not found." });
            }

            // REMOVE DUPLICATES
            var checkDuplicate = await _context.Notifications
                .Where(e => e.EventId == eventId && e.Status == "Approved")
                .ToListAsync();
            
            if (checkDuplicate.Count > 0) {
                foreach ( var duplicateItem in checkDuplicate) {
                    _context.Notifications.Remove(duplicateItem);
                }
            }
            await _context.SaveChangesAsync();

            eventToApprove.Status = "Approved";

            var notifications = new Notification
            {
                UserId = eventToApprove.OrganizerId,
                EventId = eventToApprove.Id,
                NotificationImage = "fwvsdv.jpg",
                Message = "Your event has been approved.",
                Type = "Organizer",
                Status = "Approved",
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

            // REMOVE DUPLICATES
            var checkDuplicate = await _context.Notifications
                .Where(e => e.EventId == eventId && e.Status == "Pre-Approved")
                .ToListAsync();
            
            if (checkDuplicate.Count > 0) {
                foreach ( var duplicateItem in checkDuplicate) {
                    _context.Notifications.Remove(duplicateItem);
                }
            }
            await _context.SaveChangesAsync();

            eventToApprove.Status = "Pre-Approved";

            var notifications = new Notification
            {
                UserId = eventToApprove.OrganizerId,
                EventId = eventToApprove.Id,
                NotificationImage = "fwvsdv.jpg",
                Type = "Organizer",
                Status = "Pre-Approved",
                Message = "Your event has been pre-approved.",
                CreatedAt = DateTime.Now,
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

            // REMOVE DUPLICATES
            var checkDuplicate = await _context.Notifications
                .Where(e => e.EventId == eventId && e.Status == "Rejected")
                .ToListAsync();
            
            if (checkDuplicate.Count > 0) {
                foreach ( var duplicateItem in checkDuplicate) {
                    _context.Notifications.Remove(duplicateItem);
                }
            }
            await _context.SaveChangesAsync();

            eventToReject.Status = "Rejected";
            
            var notifications = new Notification
            {
                UserId = eventToReject.OrganizerId,
                EventId = eventToReject.Id,
                NotificationImage = "fwvsdv.jpg",
                Type = "Organizer",
                Status = "Rejected",
                Message = "Your event has been rejected.",
                CreatedAt = DateTime.Now,
            };

            _context.Notifications.Add(notifications);
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
                .Take(5)
                .Select(n => new NotificationsDto
                {
                    Id = n.Id,
                    UserId = n.UserId,
                    EventId = n.EventId,
                    Type = n.Type,
                    Message = n.Message,
                    Status = n.Status,
                    UserName = n.User.Username,
                    EventTitle = n.Event.Title,
                    EventDesc = n.Event.Description,
                    EventImage = n.Event.EventImage,
                    EventDate = n.Event.DateStart,
                    EventLocation = n.Event.Location,
                    CreatedAt = n.CreatedAt,
                })
                .ToListAsync();

            if (notifications == null)
            {
                return NotFound(new { message = "Notifications not found." });
            }

            return Ok(notifications);
        }

        [HttpPut("{id}/update-event")]
        public async Task<IActionResult> UpdateEvent(int id, [FromForm] EventsDto eventsDto)
        {
            var @event = await _context.Events.FindAsync(id);
            if (@event == null) return NotFound(new { message = "Event not found." });

            var eventImage = @event.EventImage;
            var uploadedFile = eventsDto.EventImage;
            string fileName = null!;

            if (uploadedFile != null && uploadedFile.Length > 0)
            {
                fileName = uploadedFile.FileName; 
                var uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, "uploads");
                var filePathToDelete = Path.Combine(uploadPath, eventImage);
                var filePath = Path.Combine(uploadPath, fileName);
                
                // Delete the old Event Image
                if (System.IO.File.Exists(filePathToDelete))
                {
                    System.IO.File.Delete(filePathToDelete);
                }

                // Save the file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await uploadedFile.CopyToAsync(fileStream);
                }
            }

            @event.Title = eventsDto.Title;
            @event.Description = eventsDto.Description;
            @event.DateStart = eventsDto.DateStart;
            @event.DateEnd = eventsDto.DateEnd;
            @event.TimeStart = eventsDto.TimeStart;
            @event.TimeEnd = eventsDto.TimeEnd;
            @event.Location = eventsDto.Location;
            @event.MaxCapacity = eventsDto.MaxCapacity;
            @event.CampusType = eventsDto.CampusType;
            @event.EventType = eventsDto.EventType;
            @event.Visibility = eventsDto.Visibility;
            @event.RequireApproval = eventsDto.RequireApproval;
            @event.Partnerships = eventsDto.Partnerships;
            @event.HostedBy = eventsDto.HostedBy;
            @event.EventImage = !string.IsNullOrEmpty(fileName) ? fileName : @event.EventImage;

            _context.Events.Update(@event);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Event updated successfully." });
        }

        [HttpPost("new-school-year")]
        public async Task<IActionResult> NewSchoolYear([FromForm] SchoolYearDto schoolYearDto)
        {
            // Validate School Year Range
            var validate = await _context.SchoolYears
                .Where(s => (s.DateStart <= schoolYearDto.DateStart && s.DateEnd >= schoolYearDto.DateStart) ||
                            (s.DateStart >= schoolYearDto.DateStart && s.DateStart <= schoolYearDto.DateEnd))
                .FirstOrDefaultAsync();

            if (validate != null) 
                return Conflict("The start date of the new school year cannot be within the range of an existing school year.");

            // Check Duplication
            var checkDuplicate = await _context.SchoolYears
                .Where(s => s.DateStart == schoolYearDto.DateStart && s.DateEnd == schoolYearDto.DateEnd)
                .FirstOrDefaultAsync();

            if (checkDuplicate != null) 
                return Conflict("A school year with the same start and end date already exists.");

            // Create New School Year
            var newSchoolYear = new SchoolYear
            {
                DateStart = schoolYearDto.DateStart,
                DateEnd = schoolYearDto.DateEnd,
                IsArchived = false
            };
            _context.SchoolYears.Add(newSchoolYear);
            await _context.SaveChangesAsync();


            // Archive Previous School Years
            var oldSchoolYears = await _context.SchoolYears
                .Where(e => e.DateStart != schoolYearDto.DateStart 
                    && e.DateEnd != schoolYearDto.DateEnd).ToListAsync();

            foreach (var oldSchoolYear in oldSchoolYears)
            {
                oldSchoolYear.IsArchived = true;
                _context.SchoolYears.Update(oldSchoolYear);
            }

            // Archive all events associated with this school year
            var eventsToArchive = await _context.Events
                .Where(e => e.SchoolYearId != newSchoolYear.Id).ToListAsync();
                
            foreach (var eventToArchive in eventsToArchive)
            {
                eventToArchive.Status = "Archived";
                _context.Events.Update(eventToArchive);
            }
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "New School Year Added!" });
        }

        [HttpGet("search-all")]
        public async Task<IActionResult> SearchAll([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query is required");
            }

            try 
            {
                var events = await _context.Events
                    .Where(e => 
                        (e.Title.Contains(query) || 
                        e.Description.Contains(query) || 
                        e.Location.Contains(query)) &&
                        e.Status == "Approved"
                    )
                    .Take(5)
                    .Select(e => new 
                    {
                        Type = "Event",
                        e.Id,
                        e.Title,
                        e.Description,
                        e.Location,
                        e.EventImage,
                        e.DateStart
                    })
                    .ToListAsync();

                var users = await _context.Users
                    .Where(u => 
                        (u.Username.Contains(query) || 
                        u.Email.Contains(query)) &&
                        u.Role != "Admin"
                    )
                    .Take(5)
                    .Select(u => new 
                    {
                        Type = "User",
                        u.Id,
                        u.Username,
                        u.Profile_Image,
                        u.Attended_Events,
                        u.Created_Events,
                        u.Role,
                        u.Department
                    })
                    .ToListAsync();

                // Combine results
                var combinedResults = events
                    .Cast<object>()
                    .Concat(users.Cast<object>())
                    .ToList();

                return Ok(combinedResults);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Search failed", error = ex.Message });
            }
        }

        [HttpGet("search-for-organizer")]
        public async Task<IActionResult> SearchPrivate([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query is required");
            }

            try 
            {
                var users = await _context.Users
                    .Where(e => 
                        (e.Username.Contains(query) || 
                        e.Email.Contains(query)) &&
                        e.Role != "Admin"
                    )
                    .Take(5) // Limit to 5 results
                    .Select(e => new 
                    {
                        Type = "User",
                        e.Id,
                        e.Username,
                        e.Profile_Image,
                        e.Attended_Events,
                        e.Created_Events,
                        e.Role,
                        e.Department
                    })
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Search failed", error = ex.Message });
            }
        }
    }
}