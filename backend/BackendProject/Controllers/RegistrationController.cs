using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendProject.Models;
using BackendProject.Data;

//Google Sheets
using System.Net.Http;
using System.Text.Json;
using System.Text;

namespace BackendProject.Controllers 
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController : Controller
    {
        private readonly ApplicationDbContext _context;
        // private readonly EmailService _emailService;

        public RegistrationController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            // _emailService = emailService;
        }

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

            if (eventToJoin.Attendees_Count == eventToJoin.Max_Capacity) {
                var waitlisted = new RForm
                {
                    User_Id = rformDto.User_Id,
                    Event_Id = rformDto.Event_Id,
                    Event_Title = rformDto.Event_Title,
                    Name = rformDto.Name,
                    Email = rformDto.Email, 
                    School_Id = rformDto.School_Id,  
                    Section = rformDto.Section,
                    Status = "Pending"
                };
                _context.RForms.Add(waitlisted);
                await _context.SaveChangesAsync();
                return Ok(new { 
                    message = "Event is full. You have been added to the waitlist.", 
                    status = "Pending" 
                });
            }

            var attendee = new RForm
            {
                User_Id = rformDto.User_Id,
                Event_Id = rformDto.Event_Id,
                Event_Title = rformDto.Event_Title,
                Name = rformDto.Name,
                Email = rformDto.Email, 
                School_Id = rformDto.School_Id,  
                Section = rformDto.Section,
                Status = "Approved"
            };

            _context.RForms.Add(attendee);
            await _context.SaveChangesAsync();

            // +1 to Attendees
            eventToJoin.Attendees_Count += 1; 
            _context.Events.Update(eventToJoin); 
            await _context.SaveChangesAsync(); 

            var userJoined = await _context.Users.FindAsync(rformDto.User_Id);
            userJoined.Attended_Events += 1;
            _context.Users.Update(userJoined);
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

        // ----------------------FETCH REGISTRATION FORM--------------------------------
        [HttpGet("form")]
        public async Task<IActionResult> GetForm()
        {
            var Form = await _context.RForms
                .Where(e => e.Status == "Approved")
                .ToListAsync(); // Use ToListAsync to get the results as a list
                
            return Ok(Form);
        }

        [HttpPost("sheets")]
        public async Task<IActionResult> UpdateGoogleSheets([FromBody] List<GoogleSheetsDto> entries)
        {
            if (entries == null || !entries.Any())
            {
                return BadRequest(new { message = "No entries provided." });
            }

           foreach (var entry in entries)
            {
                // Validate each entry
                if (string.IsNullOrEmpty(entry.Name) || 
                    string.IsNullOrEmpty(entry.Email) || 
                    string.IsNullOrEmpty(entry.SchoolId) || 
                    string.IsNullOrEmpty(entry.Section))
                {
                    return BadRequest(new { message = "All fields are required for each entry." });
                }

                // Prepare the data for Google Apps Script
                var payload = new
                {
                    name = entry.Name,
                    email = entry.Email,
                    schoolId = entry.SchoolId,
                    section = entry.Section,
                    eventId = entry.EventId,
                    eventTitle = entry.EventTitle
                };

                using var client = new HttpClient();
                var content = new StringContent(
                    JsonSerializer.Serialize(payload),
                    Encoding.UTF8,
                    "application/json"
                );

                // Your Google Apps Script URL
                var url = "https://script.google.com/macros/s/AKfycbxw2ohrlJK9ihNqTMdieH3Mb3BOlsodBaOic4SOEfWgZ4hMxzIyXEi7GUixBM5gAygs/exec";

                var response = await client.PostAsync(url, content);
                
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, new { message = "Failed to update Google Sheets" });
                }

                // Email Service
                // string email = entry.Email;
                // string emailSubject = "Registration Approved for " + entry.EventTitle;
                // string emailBody = "You've got a spot at " + entry.EventTitle;
                // string firstName = entry.Name;

                // string result = _emailService.sendEmail(email, emailSubject, emailBody, firstName);
            }

            return Ok(new { message = "Successfully updated Google Sheets" });
        }
    }
}