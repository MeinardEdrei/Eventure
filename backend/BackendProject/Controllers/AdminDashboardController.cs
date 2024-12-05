using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendProject.Models;
using BackendProject.Data;

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

    [HttpGet("status")]
    public async Task<IActionResult> GetEventStatusCounts()
    {
      // Assuming 'Event' is your model and it has a 'Status' property
      var pendingCount = await _context.Events.CountAsync(e => e.Status == "Pending");
      var preApprovedCount = await _context.Events.CountAsync(e => e.Status == "Pre-Approved");
      var approvedCount = await _context.Events.CountAsync(e => e.Status == "Approved");
      var modified = await _context.Events.CountAsync(e => e.Status == "Modified");
      var disapprovedCount = await _context.Events.CountAsync(e => e.Status == "Disapproved");

      // Storing counts in an array
      var statusCounts = new int[] { pendingCount, preApprovedCount, approvedCount, modified, disapprovedCount };

      // Returning the array in the response
      return Ok(statusCounts);
    }

    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcomingEvents()
    {
      var now = DateTimeOffset.Now;

      var events = await _context.Events
        .Where(e => e.DateStart != null && e.TimeStart != null)
        .ToListAsync();

      // Perform the parsing and filtering in memory
      var upcomingCount = events
          .Where(e =>
          {
              if (DateTime.TryParse(e.DateStart.ToString(), out var date) &&
                  TimeSpan.TryParse(e.TimeStart.ToString(), out var time))
              {
                  return date.Add(time) > now;
              }
              return false;
          })
          .Count();

      return Ok(upcomingCount);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveCounts()
    {
      var activeCount = await _context.Users.CountAsync(u => u.Role == "Organizer");

      return Ok(activeCount);
    }

    [HttpGet("event")]
    public async Task<IActionResult> GetEventCounts()
    {
      var eventDates = await _context.Events
        .Where(e => e.DateStart != null)
        .ToListAsync();

      int[] eventCounts = new int[12];

      // Loop through each event and increment the count for the corresponding month
      foreach (var e in eventDates)
      {
          if (DateTime.TryParse(e.DateStart.ToString(), out var date))
          {
              // Increment the count for the month (month is 1-12, so subtract 1 for zero-based index)
              eventCounts[date.Month - 1]++;
          }
      }

      
      return Ok(eventCounts);
    }

    [HttpGet("on-campus")]
    public async Task<IActionResult> GetOnCampusCounts()
    {
      try
    {
        // Get only on-campus events where DateStart is not null
        var campusDates = await _context.Events
            .Where(e => e.DateStart != null && e.CampusType == "On Campus")
            .ToListAsync();

        // Create an array to hold the counts for on-campus events for each month
        int[] onCampusCounts = new int[12];  // 12 months

        // Loop through each event and increment the count for the corresponding month
        foreach (var e in campusDates)
        {
            var date = e.DateStart;  // No need to parse if it's already DateTime

            // Get the month index (1-12, so subtract 1 for zero-based index)
            int monthIndex = date.Month - 1;

            // Increment the on-campus event count for the month
            onCampusCounts[monthIndex]++;
        }

        return Ok(onCampusCounts);
      }
      catch (Exception ex)
      {
          // Return a detailed error message if an exception occurs
          return StatusCode(500, $"Internal server error: {ex.Message}");
      }
    }

    [HttpGet("off-campus")]
    public async Task<IActionResult> GetOffCampusCounts()
    {
      try
    {
        // Get only on-campus events where DateStart is not null
        var campusDates = await _context.Events
            .Where(e => e.DateStart != null && e.CampusType == "Off Campus")
            .ToListAsync();

        // Create an array to hold the counts for on-campus events for each month
        int[] offCampusCounts = new int[12];  // 12 months

        // Loop through each event and increment the count for the corresponding month
        foreach (var e in campusDates)
        {
            var date = e.DateStart;  // No need to parse if it's already DateTime

            // Get the month index (1-12, so subtract 1 for zero-based index)
            int monthIndex = date.Month - 1;

            // Increment the on-campus event count for the month
            offCampusCounts[monthIndex]++;
        }

        return Ok(offCampusCounts);
      }
      catch (Exception ex)
      {
          // Return a detailed error message if an exception occurs
          return StatusCode(500, $"Internal server error: {ex.Message}");
      }
    }
  }
}