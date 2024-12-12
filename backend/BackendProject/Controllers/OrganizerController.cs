using BackendProject.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using BackendProject.Models;

// File Manipulation
using System.IO;
using System.Text.Json;
using Org.BouncyCastle.Bcpg;

namespace BackendProject.Controllers  
{
  [ApiController]
  [Route("api/[controller]")]
  public class OrganizerController : ControllerBase
  {
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _hostingEnvironment;
    public OrganizerController(ApplicationDbContext context, IWebHostEnvironment hostingEnvironment)
    {
      _context = context;
      _hostingEnvironment = hostingEnvironment;
    }


    // ----------------------ORGANIZER API--------------------------------
        [HttpGet("events/{id}")]
        public async Task<IActionResult> GetOrganizerEvents(int id)
        {
            var events = await _context.Events
            .Where(e => e.OrganizerId == id)
            .Select(e => new {
                e.Id,
                e.Title,
                e.Location,
                e.EventImage,
                e.DateStart,
                e.TimeStart,
                e.EventType,
                e.Status,
                RequirementFiles = ParseRequirementFiles(e.RequirementFiles),
                RequirementFilesCount = ParseRequirementFiles(e.RequirementFiles).Count,
            })
            .ToListAsync();

            return Ok(events);
        }

        private static List<string> ParseRequirementFiles(string requirementFiles)
        {
            if (string.IsNullOrEmpty(requirementFiles))
                return new List<string>();

            try 
            {
                return System.Text.Json.JsonSerializer.Deserialize<List<string>>(
                    requirementFiles
                ) ?? new List<string>();
            }
            catch (JsonException ex)
            {
                Console.Write(ex.Message);
                return new List<string>();
            }
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

        [HttpPost("{id}/{email}/present")]
        public async Task<IActionResult> Present(string email, int id)
        {
            var rForm = await _context.RForms
        .FirstOrDefaultAsync(r => 
            (r.Email == email || r.School_Id == email) && 
            r.Event_Id == id);

            if (rForm == null) {
                return NotFound(new { message = "Attendee not found." });
            }

            if (rForm.Status == "Attended") {
                return Conflict(new { message = "User has already been marked as present." });
            }

            rForm.Status = "Attended";
            await _context.SaveChangesAsync();
            return Ok(new { message = "Participant has been marked as present." });
        }

        [HttpPost("{id}/{email}/undo-present")]
        public async Task<IActionResult> UndoPresent(string email, int id)
        {
            var rForm = await _context.RForms
                .FirstOrDefaultAsync(r => 
                    (r.Email == email || r.School_Id == email) && 
                    r.Event_Id == id);

            if (rForm == null){
                return NotFound(new { message = "RForm not found." });
            }

            rForm.Status = "Going";
            _context.RForms.Update(rForm);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Participant Attendance undone successfully." });
        }

        [HttpPost("{id}/{email}/approve-participant")]
        public async Task<IActionResult> ApproveParticipant(string email, int id)
        {
            var rForm = await _context.RForms
                .FirstOrDefaultAsync(r => 
                    (r.Email == email || r.School_Id == email) && 
                    r.Event_Id == id);

            if (rForm == null){
                return NotFound(new { message = "RForm not found." });
            }
            rForm.Status = "Going";
            _context.RForms.Update(rForm);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Participant approved successfully." });
        }

        [HttpPost("{id}/{email}/disapprove-participant")]
        public async Task<IActionResult> DispproveParticipant(string email, int id)
        {
            var rForm = await _context.RForms
                .FirstOrDefaultAsync(r => 
                    (r.Email == email || r.School_Id == email) && 
                    r.Event_Id == id);
                    
            if (rForm == null){
                return NotFound(new { message = "RForm not found." });
            }
            rForm.Status = "Disapproved";
            _context.RForms.Update(rForm);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Participant has been disapproved." });
        }

        [HttpPost("upload-requirements")]
        public async Task<IActionResult> UploadRequirements([FromForm] List<IFormFile> files, [FromForm] int id)
        {
            var _event = await _context.Events.FindAsync(id);

            if (_event == null) { return NotFound(new { message = "Event not found." }); }

            var uploadPath = "";

            // Define the uploads folder path
            if (_event?.EventType == "Curriculum"){
                uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, "Curriculum Uploads");
            } 
            else if (_event?.EventType == "Organizational"){
                uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, "Organizational Uploads");
            } 
            else if (_event?.EventType == "College"){
                uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, "College Uploads");
            }
            
            Directory.CreateDirectory(uploadPath);

            // Deserialize existing files
            var existingFiles = string.IsNullOrEmpty(_event?.RequirementFiles) 
                ? new List<string>() 
                : System.Text.Json.JsonSerializer.Deserialize<List<string>>(_event.RequirementFiles)
                ?? new List<string>();
            
            
            foreach (var file in files) {
                if (file != null && file.Length > 0)
                {
                    try {
                        var fileName = $"{Guid.NewGuid()}_{file.FileName}"; // Store the filename
                        var filePath = Path.Combine(uploadPath, fileName);

                        // Save the file
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(fileStream);
                        }

                        existingFiles.Add(fileName);
                    } catch (Exception ex) {
                        Console.WriteLine($"Error saving file: {ex.Message}");
                        Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    }
                }
            }

            // Serialize filenames to JSON
            _event.RequirementFiles = System.Text.Json.JsonSerializer.Serialize(existingFiles);
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Requirements Uploaded Successfully" });
        }

        [HttpGet("download/{eventType}/{filename}")]
        public IActionResult DownloadFile(string eventType, string filename)
        {
          // Define the uploads folder path
          string uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, $"{eventType} Uploads");
          var filePath = Path.Combine(uploadPath, filename);

          if (!System.IO.File.Exists(filePath))
              return NotFound();

          // Read the Binary data from the file
          var fileBytes = System.IO.File.ReadAllBytes(filePath);

          return File(
            fileBytes, 
            "application/pdf", 
            filename
          );
        }

        [HttpDelete("deleteFile/{id}/{eventType}/{filename}")]
        public async Task<IActionResult> DeleteFile(int id, string eventType, string filename)
        {
          var eventEntity = await _context.Events
            .FirstOrDefaultAsync(e => e.Id == id && e.EventType == eventType && e.RequirementFiles.Contains(filename));
          
          if (eventEntity == null) return NotFound();
          
          var uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, $"{eventType} Uploads");
          var filePath = Path.Combine(uploadPath, filename);

          try {
            // Delete the file locally
            System.IO.File.Delete(filePath);

            // Update the Data in the Database
            var requirementFiles = JsonSerializer.Deserialize<List<string>>(eventEntity.RequirementFiles);
            requirementFiles?.Remove(filename);
            eventEntity.RequirementFiles = JsonSerializer.Serialize(requirementFiles);

            await _context.SaveChangesAsync();
            return Ok(new { Message = "File deleted successfully." });
          } catch (Exception ex) {
            return StatusCode(500, new { Message = "An error occurred while deleting the file.", Error = ex.Message });
          }
        }

        // -------------- NOTIFICATION API
        [HttpPost("notification")]
        public async Task<IActionResult> SendNotification([FromForm] NotificationsDto notificationsDto)
        {
            if (notificationsDto == null ) return BadRequest(new { Message = "Invalid request." });

            var file = notificationsDto.NotificationImage;
            string fileName = null!;

            if (file != null && file.Length > 0)
            {
                var uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, "Notification Uploads");
                Directory.CreateDirectory(uploadPath);

                fileName = Path.GetFileName(file.FileName);
                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                await file.CopyToAsync(stream);
                }
            }

            var newNotification = new Notification 
            {
                UserId = notificationsDto.UserId,
                EventId = notificationsDto.EventId,
                Type = notificationsDto.Type,
                Message = notificationsDto.Message,
                NotificationImage = fileName,
                Status = notificationsDto.Status,
            };

            _context.Notifications.Add(newNotification);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Notification sent successfully." });
        }

        [HttpGet("notification/image/{filename}")]
        public IActionResult GetNotificationImage(string filename)
        {
            if (string.IsNullOrEmpty(filename))
            {
                return BadRequest(new { Message = "File name cannot be empty." });
            }

            var filePath = Path.Combine(_hostingEnvironment.WebRootPath, "Notification Uploads", filename);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { Message = "Image not found." });
            }

            var contentType = "image/jpeg";
            return PhysicalFile(filePath, contentType);
        }

        [HttpGet("{id}/get-organizer")]
        public async Task<IActionResult> GetOrganizer(int id)
        {
            var organizer = await _context.Users.FindAsync(id);
            if (organizer == null) return NotFound(new { Message = "Organizer not found." });

            return Ok(organizer);
        }
        // ----------------------END OF ORGANIZER API--------------------------------
  }
}