using BackendProject.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using BackendProject.Models;

// File Manipulation
using System.IO;
using System.Text.Json;

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

        [HttpPost("upload-requirements")]
        public async Task<IActionResult> UploadRequirements([FromForm] List<IFormFile> files, [FromForm] int id)
        {
            var _event = await _context.Events.FindAsync(id);

            if (_event == null) { return NotFound(new { message = "Event not found." }); }

            var fileNames = new List<string>();
            var uploadPath = "";

            // Define the uploads folder path
            if (_event?.EventType == "Curricular"){
                uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, "Curricular Uploads");
            } 
            else if (_event?.EventType == "Organizational"){
                uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, "Organizational Uploads");
            } 
            else if (_event?.EventType == "College"){
                uploadPath = Path.Combine(_hostingEnvironment.WebRootPath, "College Uploads");
            }
            
            Directory.CreateDirectory(uploadPath);
            
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

                        fileNames.Add(fileName);
                    } catch (Exception ex) {
                        Console.WriteLine($"Error saving file: {ex.Message}");
                        Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    }
                }
            }

            // Serialize filenames to JSON
            _event.RequirementFiles = System.Text.Json.JsonSerializer.Serialize(fileNames);
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Requirements Uploaded Successfully" });
        }
        // ----------------------END OF ORGANIZER API--------------------------------
  }
}