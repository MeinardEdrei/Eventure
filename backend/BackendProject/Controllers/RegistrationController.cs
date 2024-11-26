using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendProject.Models;
using BackendProject.Data;

//Google Sheets
using System.Net.Http;
using System.Text.Json;
using System.Text;

//Excel
using OfficeOpenXml;

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
                    Status = "Pending",
                    Registered_Time = rformDto.Registered_Time,
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
                Status = "Approved",
                Registered_Time = rformDto.Registered_Time,
            };

            _context.RForms.Add(attendee);
            await _context.SaveChangesAsync();

            // +1 to Attendees
            eventToJoin.Attendees_Count += 1; 
            _context.Events.Update(eventToJoin); 
            await _context.SaveChangesAsync(); 

            var userJoined = await _context.Users.FindAsync(rformDto.User_Id);
            if (userJoined != null) {
                userJoined.Attended_Events += 1;
                _context.Users.Update(userJoined);
                await _context.SaveChangesAsync();
            }

            // Insert to user_events
            var userEvent = new UEvent
            {
                UserId = rformDto.User_Id,
                EventId = rformDto.Event_Id,
                Status = "Approved"
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
        public async Task<IActionResult> ExportToExcel([FromBody] List<ExcelSheetsDto> entries)
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

                using (var package = new ExcelPackage())
                {
                    var worksheet = package.Workbook.Worksheets.Add("Registrations");

                    // Add headers
                    worksheet.Cells["A1"].Value = "Name";
                    worksheet.Cells["B1"].Value = "Email";
                    worksheet.Cells["C1"].Value = "School ID";
                    worksheet.Cells["D1"].Value = "Section";
                    worksheet.Cells["E1"].Value = "Event";
                    worksheet.Cells["F1"].Value = "Registration Date";

                    // Style the header row
                    using (var range = worksheet.Cells["A1:F1"])
                    {
                        range.Style.Font.Bold = true;
                        range.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
                    }

                    // Add data rows
                    int row = 2;
                    foreach (var item in entries)
                    {
                        worksheet.Cells[row, 1].Value = item.Name;
                        worksheet.Cells[row, 2].Value = item.Email;
                        worksheet.Cells[row, 3].Value = item.SchoolId;
                        worksheet.Cells[row, 4].Value = item.Section;
                        worksheet.Cells[row, 5].Value = item.RegisteredTime;
                        row++;
                    }

                    // Auto-fit columns
                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                    // Generate file
                    var content = package.GetAsByteArray();
                    var contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    var fileName = $"{entry.EventTitle}_{DateTime.Now:yyyyMMdd}.xlsx";

                    return File(content, contentType, fileName);
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