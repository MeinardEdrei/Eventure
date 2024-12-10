using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendProject.Models;
using BackendProject.Data;

namespace BackendProject.Controllers 
{
  [ApiController]
  [Route("api/[controller]")]

  public class OrganizerDashboardController : ControllerBase 
  {
    private readonly ApplicationDbContext _context;
    
    public OrganizerDashboardController(ApplicationDbContext context) 
    {
      _context = context;
    }

    [HttpGet("organizer-data")]
    public async Task<IActionResult> GetOrganizerData()
    {
      /* STATUS COUNTS */
      var pendingCount = await _context.Events.CountAsync(e => e.Status == "Pending");
      var preApprovedCount = await _context.Events.CountAsync(e => e.Status == "Pre-Approved");
      var approvedCount = await _context.Events.CountAsync(e => e.Status == "Approved");
      var modified = await _context.Events.CountAsync(e => e.Status == "Modified");
      var disapprovedCount = await _context.Events.CountAsync(e => e.Status == "Disapproved");

      var statusCounts = new int[] { pendingCount, preApprovedCount, approvedCount, modified, disapprovedCount };

      /* UPCOMING EVENTS */
      var now = DateTimeOffset.Now;

      var events = await _context.Events
        .Where(e => e.DateStart != null && e.TimeStart != null)
        .ToListAsync();

      // Perform the parsing and filtering in memory
      var upcomingCount = events
        .Where(e =>
        {
            if (e.DateStart != null && e.TimeStart != null &&
                DateTime.TryParse(e.DateStart.ToString(), out var date) &&
                TimeSpan.TryParse(e.TimeStart.ToString(), out var time))
            {
                return date.Add(time) > now;
            }
            return false;
        })
        .Count();

      /* ACTIVE ORGANIZERS */
      var activeCount = await _context.Users.CountAsync(u => u.Role == "Organizer");

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
          var date = e.DateStart;  // No need to parse if it's already DateTime

          // Get the month index (1-12, so subtract 1 for zero-based index)
          int monthIndex = date.Month - 1;

          // Increment the on-campus event count for the month
          offCampusCounts[monthIndex]++;
      }

      var organizerData = new
      {
          UpcomingEvents = upcomingCount,
          EventStatus = statusCounts,
          orgActive = activeCount,
          EventsCount = eventCounts,
          OnCampusCounts = onCampusCounts,
          OffCampusCounts = offCampusCounts,
      };

      return Ok(organizerData);
    }
  }
}