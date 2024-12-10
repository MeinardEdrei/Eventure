using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendProject.Models;
using System.Text.RegularExpressions;
using BackendProject.Data;
using Newtonsoft.Json;

namespace BackendProject.Controllers 
{
  [ApiController]
  [Route("api/[controller]")]

  public class AdminDashboardController : ControllerBase 
  {
    private readonly ApplicationDbContext _context;
    
    public AdminDashboardController(ApplicationDbContext context) 
    {
      _context = context;
    }
    public class DropdownChoicesDto
    {
        public string SchoolYear { get; set; }
        public string Semester { get; set; }
        public string Department { get; set; }
    }
    
    [HttpPost("admin-data")]
    public async Task<IActionResult> GetAdminData([FromBody] DropdownChoicesDto filters)
    {
        var schoolYearFilter = filters.SchoolYear;
        var semesterFilter = filters.Semester;
        var departmentFilter = filters.Department;

        // var departmentCode = Regex.Match(departmentFilter ?? "", @"^(.*?)\s-\s")?.Groups[1]?.Value;

        // Fetch necessary data first
        var eventsQuery = _context.Events
            .Include(e => e.SchoolYear) // Include SchoolYear for filtering
            .Select(e => new
            {
                EventId = e.Id,
                Status = e.Status,
                SchoolYearId = e.SchoolYearId,
                SchoolYear = e.SchoolYear != null
                    ? $"{e.SchoolYear.DateStart.Year}-{e.SchoolYear.DateEnd.Year}"
                    : "Unknown School Year",
                Semester = e.Semester,
                HostedBy = !string.IsNullOrEmpty(e.HostedBy) 
                  ? string.Join(", ", JsonConvert.DeserializeObject<List<string>>(e.HostedBy))
                  : string.Empty,  
                DateStart = e.DateStart,
                TimeStart = e.TimeStart
            });

        var eventsData = await eventsQuery.ToListAsync();

        // Apply filtering in memory
        if (!string.IsNullOrEmpty(schoolYearFilter))
        {
          eventsData = eventsData
              .Where(e => e.SchoolYear == schoolYearFilter)
              .ToList();
        }

        if (!string.IsNullOrEmpty(semesterFilter))
        {
          if (semesterFilter == "FirstAndSecond")
          {
              eventsData = eventsData
                  .Where(e => e.Semester == "First" || e.Semester == "Second")
                  .ToList();
          }
          else
          {
              eventsData = eventsData
                  .Where(e => e.Semester == semesterFilter)
                  .ToList();
          }
        }

        if (!string.IsNullOrEmpty(departmentFilter))
        {
          if(departmentFilter == "All") 
          {
            eventsData = eventsData.ToList();
          }
          else 
          {
            eventsData = eventsData
              .Where(e => !string.IsNullOrEmpty(e.HostedBy) && e.HostedBy.Split(' ')[0] == departmentFilter)
              .ToList(); 
          }
        }
      
      /* STATUS COUNTS */
      var pendingCount = eventsData.Count(e => e.Status == "Pending");
        var preApprovedCount = eventsData.Count(e => e.Status == "Pre-Approved");
        var approvedCount = eventsData.Count(e => e.Status == "Approved");
        var modifiedCount = eventsData.Count(e => e.Status == "Modified");
        var disapprovedCount = eventsData.Count(e => e.Status == "Disapproved");

      var statusCounts = new int[] { pendingCount, preApprovedCount, approvedCount, modifiedCount, disapprovedCount };

      /* UPCOMING EVENTS */
      var now = DateTimeOffset.Now;

      var events = await _context.Events
        .Where(e => e.DateStart != null && e.TimeStart != null)
        .ToListAsync();

      // Perform the parsing and filtering in memory
      var upcomingCount = eventsData
                .Where(e =>
                    e.DateStart != null && e.TimeStart != null &&
                    DateTime.TryParse(e.DateStart.ToString(), out var date) &&
                    TimeSpan.TryParse(e.TimeStart.ToString(), out var time) &&
                    date.Add(time) > now)
                .Count();

      /* ACTIVE ORGANIZERS */
      var activeCount = await _context.Users.CountAsync(u => u.Role == "Organizer");

      /* REGISTERED STUDENTS */
      var registeredCount = await _context.Users.CountAsync(u => u.Role == "Student");

      /* EVENTS COUNTS */
      var eventDates = await _context.Events
        .Where(e => e.DateStart != null)
        .ToListAsync();

      int[] eventCounts = new int[12];

      foreach (var e in eventDates)
      {
          if (DateTime.TryParse(e.DateStart.ToString(), out var date))
          {
              eventCounts[date.Month - 1]++;
          }
      }

      /* ON-CAMPUS COUNTS */
      var onCampusDates = await _context.Events
          .Where(e => e.DateStart != null && e.CampusType == "On Campus")
          .ToListAsync();

      int[] onCampusCounts = new int[12];  

      foreach (var e in onCampusDates)
      {
          var date = e.DateStart; 

          // Get the month index (1-12, so subtract 1 for zero-based index)
          int monthIndex = date.Month - 1;

          // Increment the on-campus event count for the month
          onCampusCounts[monthIndex]++;
      }

      /* OFF-CAMPUS COUNTS */
      var offCampusDates = await _context.Events
          .Where(e => e.DateStart != null && e.CampusType == "Off Campus")
          .ToListAsync();

      int[] offCampusCounts = new int[12]; 

      foreach (var e in offCampusDates)
      {
          var date = e.DateStart;  

          // Get the month index (1-12, so subtract 1 for zero-based index)
          int monthIndex = date.Month - 1;

          // Increment the on-campus event count for the month
          offCampusCounts[monthIndex]++;
      }

      var adminData = new
      {
          UpcomingEvents = upcomingCount,
          EventStatus = statusCounts,
          ActiveCounts = activeCount,
          EventsCount = eventCounts,
          OnCampusCounts = onCampusCounts,
          OffCampusCounts = offCampusCounts,
          RegisteredStudents = registeredCount,
          Hihi = eventsQuery,
      };

      return Ok(adminData);
    }
  }
}