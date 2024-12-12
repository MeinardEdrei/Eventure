using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendProject.Models;
using BackendProject.Data;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using Newtonsoft.Json;

namespace BackendProject.Controllers 
{
  [ApiController]
  [Route("api/[controller]")]

  public class OrganizerDashboardController : ControllerBase 
  {
    private readonly ApplicationDbContext _context;
    private const float LEFT_MARGIN = 35;
    private const float RIGHT_MARGIN = 35;
    private const float TOP_MARGIN = 35;
    private const float BOTTOM_MARGIN = 35;
    
    public OrganizerDashboardController(ApplicationDbContext context) 
    {
      _context = context;
    }
    public class DropdownChoicesDto
    {
        public string SchoolYear { get; set; }
        public string Semester { get; set; }
    }
    private (List<string> filteredLabels, List<List<int>> filteredData) FilterDataBySemester(string semester, List<string> labels, params List<int>[] dataArrays)
    {
      List<string> filteredLabels = new List<string>();
      List<List<int>> filteredData = dataArrays.Select(dataArray => new List<int>()).ToList();

      if (semester == "First")
      {
          // For 1st semester: August to January
          filteredLabels = labels.Skip(7).Concat(labels.Take(1)).ToList();
          filteredData = dataArrays.Select(dataArray => dataArray.Skip(7).Concat(dataArray.Take(1)).ToList()).ToList();
      }
      else if (semester == "Second")
      {
          // For 2nd semester: January to July
          filteredLabels = labels.Take(7).ToList();
          filteredData = dataArrays.Select(dataArray => dataArray.Take(7).ToList()).ToList();
      }
      else if (semester == "FirstAndSecond")
      {
          // For 1st - 2nd semester: August to July
          filteredLabels = labels.Skip(7).Concat(labels.Take(7)).ToList();
          filteredData = dataArrays.Select(dataArray => dataArray.Skip(7).Concat(dataArray.Take(7)).ToList()).ToList();
      }

      return (filteredLabels, filteredData);
    }

    [HttpPost("organizer-data/{id}")]
    public async Task<IActionResult> GetOrganizerData(int id, [FromBody] DropdownChoicesDto filters)
    {      
      var schoolYearFilter = filters.SchoolYear;
      var semesterFilter = filters.Semester;

      var eventsData = await _context.Events
        .Include(e => e.SchoolYear)
        .Where(e => e.OrganizerId == id) // Filter by OrganizerId
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
          TimeStart = e.TimeStart,
          OrganizerId = e.OrganizerId,
          AttendeesCount = e.AttendeesCount,
          CampusType = e.CampusType,
        })
        .ToListAsync();

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
      
      /* STATUS COUNTS */
      var pendingCount = eventsData.Count(e => e.Status == "Pending");
      var preApprovedCount = eventsData.Count(e => e.Status == "Pre-Approved");
      var approvedCount = eventsData.Count(e => e.Status == "Approved");
      var modifiedCount = eventsData.Count(e => e.Status == "Modified");
      var disapprovedCount = eventsData.Count(e => e.Status == "Disapproved");

      var statusCounts = new int[] { pendingCount, preApprovedCount, approvedCount, modifiedCount, disapprovedCount };

      /* UPCOMING EVENTS */
      var now = DateTime.Now;
      var currentMonth = now.Month;
      var currentYear = now.Year;

      var upcomingEvents = eventsData
      .Where(e => e.DateStart != null && e.TimeStart != null)
      .Where(e => e.DateStart.Add(e.TimeStart) > now) // Combine DateStart and TimeStart
      .ToList();

      var upcomingCount = eventsData
          .Where(e => e.DateStart != null && e.TimeStart != null) // Ensure the values are not null
          .Where(e => e.DateStart.Add(e.TimeStart) > now) // Combine DateStart and TimeStart
          .Count();

      /* MONTHLY ENGAGEMENTS */
      var eventsInCurrentMonth = eventsData
        .Where(e => e.DateStart.Year == currentYear && e.DateStart.Month == currentMonth)
        .ToList();

      var totalAttendees = eventsInCurrentMonth.Sum(e => e.AttendeesCount);
      var totalEvents = eventsInCurrentMonth.Count;
      var monthlyEngagementCount = totalAttendees / totalEvents;
      Console.WriteLine($" {totalAttendees} / {totalEvents} Total Count: {monthlyEngagementCount}");
      
      /* CREATED EVENTS */
      var totalEventsCreated = await _context.Users
        .Where(u => u.Id == id)  // Find the user by id
        .Select(u => u.Created_Events)  // Select the Created_Events column
        .FirstOrDefaultAsync();  // Retrieve the value

      /* EVENTS COUNTS */
      var eventDates = eventsData
          .Where(e => e.DateStart != null && e.TimeStart != null)
          .ToList();

      var eventCounts = new int[12];
      var onCampusCounts = new int[12];
      var offCampusCounts = new int[12];

      foreach (var e in eventDates)
      {
          if (DateTime.TryParse(e.DateStart.ToString(), out var date))
          {
              int monthIndex = date.Month - 1;
              eventCounts[monthIndex]++;
              
              if (e.CampusType == "On Campus")
              {
                  onCampusCounts[monthIndex]++;
              }
              else if (e.CampusType == "Off Campus")
              {
                  offCampusCounts[monthIndex]++;
              }
          }
      }

      // Apply semester-based filtering
      var originalLabels = new List<string> { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
      var (filteredLabels, filteredData) = FilterDataBySemester(semesterFilter, originalLabels, eventCounts.ToList(), onCampusCounts.ToList(), offCampusCounts.ToList());

      var organizerData = new
      {
        EventStatus = statusCounts,
        UpcomingEvents = upcomingCount,
        CreatedEvents = totalEventsCreated,
        EventsCount = filteredData[0],
        OnCampusCounts = filteredData[1],
        OffCampusCounts = filteredData[2],
        Labels = filteredLabels,
        MonthlyEngagement = monthlyEngagementCount,
      };

      return Ok(organizerData);
    }

    [HttpGet("dropdown-values")]
    public async Task<IActionResult> GetDropdownValues()
    {
      var schoolYears = _context.SchoolYears
        .Select(e => e.DateStart != null && e.DateEnd != null
            ? $"{e.DateStart.Year}-{e.DateEnd.Year}"
            : "Empty School Year")
        .ToList();

      return Ok(schoolYears);
    }

    private string FormatTimeSpan(TimeSpan time)
    {
        var hours = time.Hours % 12; // Convert to 12-hour format
        var period = time.Hours >= 12 ? "PM" : "AM"; // Determine AM/PM

        // Ensure 2-digit minutes
        var formattedTime = string.Format("{0:D2}:{1:D2} {2}", hours == 0 ? 12 : hours, time.Minutes, period);
        return formattedTime;
    }

    [HttpPost("export/{id}")]
    public async Task<IActionResult> ExportEvents(int id, [FromBody] DropdownChoicesDto filters)
    {
      var schoolYearFilter = filters.SchoolYear;
      var semesterFilter = filters.Semester;

      var eventsData = await _context.Events
        .Include(e => e.SchoolYear)
        .Where(e => e.OrganizerId == id) // Filter by OrganizerId
        .Select(e => new
        {
          EventId = e.Id,
          Title = e.Title,
          DateStart = e.DateStart,
          DateEnd = e.DateEnd,
          TimeStart = e.TimeStart,
          TimeEnd = e.TimeEnd,
          EventType = e.EventType,
          CampusType = e.CampusType,
          Location = e.Location,
          MaxCapacity = e.MaxCapacity,
          Status = e.Status,
          Visibility = e.Visibility,
          SchoolYearId = e.SchoolYearId,
          SchoolYear = e.SchoolYear != null
              ? $"{e.SchoolYear.DateStart.Year}-{e.SchoolYear.DateEnd.Year}"
              : "Unknown School Year",
          Semester = e.Semester,
          HostedBy = !string.IsNullOrEmpty(e.HostedBy) 
            ? string.Join(", ", JsonConvert.DeserializeObject<List<string>>(e.HostedBy))
            : string.Empty, 
          OrganizerId = e.OrganizerId,
          AttendeesCount = e.AttendeesCount,
        })
        .ToListAsync();

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
      
      /* STATUS COUNTS */
      var pendingCount = eventsData.Count(e => e.Status == "Pending");
      var preApprovedCount = eventsData.Count(e => e.Status == "Pre-Approved");
      var approvedCount = eventsData.Count(e => e.Status == "Approved");
      var modifiedCount = eventsData.Count(e => e.Status == "Modified");
      var disapprovedCount = eventsData.Count(e => e.Status == "Disapproved");

      var statusCounts = new int[] { pendingCount, preApprovedCount, approvedCount, modifiedCount, disapprovedCount };

      /* UPCOMING EVENTS */
      var now = DateTime.Now;
      var currentMonth = now.Month;
      var currentYear = now.Year;

      var upcomingEvents = eventsData
      .Where(e => e.DateStart != null && e.TimeStart != null)
      .Where(e => e.DateStart.Add(e.TimeStart) > now) // Combine DateStart and TimeStart
      .ToList();

      var upcomingCount = eventsData
          .Where(e => e.DateStart != null && e.TimeStart != null) // Ensure the values are not null
          .Where(e => e.DateStart.Add(e.TimeStart) > now) // Combine DateStart and TimeStart
          .Count();

      /* MONTHLY ENGAGEMENTS */
      var eventsInCurrentMonth = eventsData
        .Where(e => e.DateStart.Year == currentYear && e.DateStart.Month == currentMonth)
        .ToList();

      var totalAttendees = eventsInCurrentMonth.Sum(e => e.AttendeesCount);
      var totalEvents = eventsInCurrentMonth.Count;
      var monthlyEngagementCount = totalAttendees / totalEvents;
      Console.WriteLine($" {totalAttendees} / {totalEvents} Total Count: {monthlyEngagementCount}");
      
      /* CREATED EVENTS */
      var totalEventsCreated = await _context.Users
        .Where(u => u.Id == id)  // Find the user by id
        .Select(u => u.Created_Events)  // Select the Created_Events column
        .FirstOrDefaultAsync();  // Retrieve the value

      /* EVENTS COUNTS */
      var eventDates = eventsData
          .Where(e => e.DateStart != null && e.TimeStart != null)
          .ToList();

      var eventCounts = new int[12];
      var onCampusCounts = new int[12];
      var offCampusCounts = new int[12];

      foreach (var e in eventDates)
      {
          if (DateTime.TryParse(e.DateStart.ToString(), out var date))
          {
              int monthIndex = date.Month - 1;
              eventCounts[monthIndex]++;
              
              if (e.CampusType == "On Campus")
              {
                  onCampusCounts[monthIndex]++;
              }
              else if (e.CampusType == "Off Campus")
              {
                  offCampusCounts[monthIndex]++;
              }
          }
      }

      // Apply semester-based filtering
      var originalLabels = new List<string> { "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" };
      var (filteredLabels, filteredData) = FilterDataBySemester(semesterFilter, originalLabels, eventCounts.ToList(), onCampusCounts.ToList(), offCampusCounts.ToList());

      var organizerData = new
      {
        EventStatus = statusCounts,
        UpcomingEvents = upcomingCount,
        CreatedEvents = totalEventsCreated,
        EventsCount = filteredData[0],
        OnCampusCounts = filteredData[1],
        OffCampusCounts = filteredData[2],
        Labels = filteredLabels,
        MonthlyEngagement = monthlyEngagementCount,
      };

      try
      {
          var eventsDetails = await _context.Events
              .OrderBy(e => e.DateStart) // Optional: Order events by date
              .ToListAsync();

          if (eventsDetails == null || !eventsDetails.Any())
          {
              return BadRequest("No events to export.");
          }

          using var document = new PdfDocument();
          var page = document.AddPage();
          var graphics = XGraphics.FromPdfPage(page);

          double contentWidth = page.Width - LEFT_MARGIN - RIGHT_MARGIN;
          var titleFont = new XFont("Arial", 21, XFontStyle.Bold);
          var subTitleFont = new XFont("Arial", 15, XFontStyle.Bold);
          var normalFont = new XFont("Arial", 14, XFontStyle.Regular);

          double currentY = TOP_MARGIN;

          // Title
          graphics.DrawString("Event Report", titleFont, XBrushes.Black,
              new XRect(LEFT_MARGIN, currentY, contentWidth, 30), XStringFormats.TopLeft);
          currentY += 40;

          // Draw table headers with lines
          XPen linePen = new XPen(XColors.Black, 0.5);
          
          // Header Row
          graphics.DrawString($"Created Events: {organizerData.CreatedEvents}", titleFont, XBrushes.Black,
              new XRect(LEFT_MARGIN, currentY, contentWidth / 3, 20), XStringFormats.TopLeft);
          
          currentY += 25;
          graphics.DrawLine(linePen, LEFT_MARGIN, currentY, LEFT_MARGIN + contentWidth, currentY);

          // foreach (var eventDetail in eventsDetails)
          // {
          //     // Check if we need a new page
          //     if (currentY > page.Height - BOTTOM_MARGIN - 50)
          //     {
          //         page = document.AddPage();
          //         graphics = XGraphics.FromPdfPage(page);
          //         currentY = TOP_MARGIN;
          //     }

          //     // Draw event details
          //     graphics.DrawString(eventDetail.Title ?? "N/A", normalFont, XBrushes.Black,
          //         new XRect(LEFT_MARGIN, currentY, contentWidth / 3, 20), XStringFormats.TopLeft);
              
          //     graphics.DrawString(eventDetail.DateStart.ToString("MM/dd/yyyy"), normalFont, XBrushes.Black,
          //         new XRect(LEFT_MARGIN + contentWidth / 3, currentY, contentWidth / 3, 20), XStringFormats.TopLeft);
              
          //     graphics.DrawString(eventDetail.Location ?? "N/A", normalFont, XBrushes.Black,
          //         new XRect(LEFT_MARGIN + 2 * contentWidth / 3, currentY, contentWidth / 3, 20), XStringFormats.TopLeft);

          //     currentY += 20;
          // }

          using var stream = new MemoryStream();
          document.Save(stream, false);

          return File(stream.ToArray(), "application/pdf", "EventReport.pdf");
      }
      catch (Exception ex)
      {
          Console.WriteLine($"Error generating PDF: {ex}");
          return StatusCode(500, "An error occurred while generating the PDF.");
      }
    }
  }
}