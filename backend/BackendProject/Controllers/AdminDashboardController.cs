using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendProject.Models;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
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
    private const float LEFT_MARGIN = 35;
    private const float RIGHT_MARGIN = 35;
    private const float TOP_MARGIN = 35;
    private const float BOTTOM_MARGIN = 35;
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
      var disapprovedCount = eventsData.Count(e => e.Status == "Rejected");

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
          .Where(e => e.DateStart != null && e.TimeStart != null)
          .ToListAsync();

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

      var adminData = new
      {
          UpcomingEvents = upcomingCount,
          EventStatus = statusCounts,
          ActiveCounts = activeCount,
          EventsCount = filteredData[0],
          OnCampusCounts = filteredData[1],
          OffCampusCounts = filteredData[2],
          RegisteredStudents = registeredCount,
          Labels = filteredLabels,
          SchoolYearDropdown = schoolYearFilter,
      };

      return Ok(adminData);
    }

    [HttpGet("dropdown-values")]
    public async Task<IActionResult> GetDropdownValues()
    {
      var schoolYears = _context.SchoolYears
        .Select(e => e.DateStart != null && e.DateEnd != null
            ? $"{e.DateStart.Year}-{e.DateEnd.Year}"
            : "Empty School Year")
        .ToList();

      var departments = await _context.Users
        .Where(u => u.Role == "Organizer" && !string.IsNullOrEmpty(u.Department))
        .Select(u => u.Department)
        .Distinct()  // Ensures unique department values
        .ToListAsync();

      var dropdownValues = new {
        SchoolYears = schoolYears,
        Departments = departments,
      };

      return Ok(dropdownValues);
    }

    private string FormatTimeSpan(TimeSpan time)
    {
        var hours = time.Hours % 12; // Convert to 12-hour format
        var period = time.Hours >= 12 ? "PM" : "AM"; // Determine AM/PM

        // Ensure 2-digit minutes
        var formattedTime = string.Format("{0:D2}:{1:D2} {2}", hours == 0 ? 12 : hours, time.Minutes, period);
        return formattedTime;
    }
    [HttpPost("export")]
    public async Task<IActionResult> ExportEvents([FromBody] DropdownChoicesDto filters)
    {
      var schoolYearFilter = filters.SchoolYear;
      var semesterFilter = filters.Semester;
      var departmentFilter = filters.Department;

        // Fetch necessary data first
        var eventsQuery = _context.Events
            .Include(e => e.SchoolYear) // Include SchoolYear for filtering
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
      var disapprovedCount = eventsData.Count(e => e.Status == "Rejected");

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
          .Where(e => e.DateStart != null && e.TimeStart != null)
          .ToListAsync();

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

      var adminData = new
      {
          UpcomingEvents = upcomingCount,
          EventStatus = statusCounts,
          ActiveCounts = activeCount,
          EventsCount = filteredData[0],
          OnCampusCounts = filteredData[1],
          OffCampusCounts = filteredData[2],
          RegisteredStudents = registeredCount,
          Labels = filteredLabels,
          SchoolYearDropdown = schoolYearFilter,
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
          page.Width = 842; 
          page.Height = 1684; 
          page.Orientation = PdfSharpCore.PageOrientation.Landscape;

          var graphics = XGraphics.FromPdfPage(page);

          double contentWidth = page.Width - LEFT_MARGIN - RIGHT_MARGIN;
          var titleFont = new XFont("Times New Roman", 23, XFontStyle.Bold);
          var subTitleFont = new XFont("Times New Roman", 19, XFontStyle.Bold);
          var headersFont = new XFont("Times New Roman", 10, XFontStyle.Bold);
          var normalFont = new XFont("Times New Roman", 8, XFontStyle.Regular);

          double currentY = TOP_MARGIN;

          // Title
        graphics.DrawString("Events Report", titleFont, XBrushes.Black,
            new XRect(LEFT_MARGIN, currentY, contentWidth, 30), XStringFormats.TopLeft);
        currentY += 50;

        graphics.DrawString($"School Year: {schoolYearFilter}", subTitleFont, XBrushes.Black,
            new XRect(LEFT_MARGIN, currentY, contentWidth, 30), XStringFormats.TopLeft);
        var semesterReport = "";
        if(semesterFilter == "FirstAndSecond") semesterReport = "First and Second";
        graphics.DrawString($"Semester: {semesterReport}", subTitleFont, XBrushes.Black,
            new XRect(LEFT_MARGIN + 250, currentY, contentWidth, 30), XStringFormats.TopLeft);
        graphics.DrawString($"Department: {departmentFilter}", subTitleFont, XBrushes.Black,
            new XRect(LEFT_MARGIN + 525, currentY, contentWidth, 30), XStringFormats.TopLeft);
        currentY += 60;

        // Adjusting for 10 header columns
        string[] headers = { "Title", "Campus Type", "Event Type", "Location", "Department", "Status", "Attendees", "Date", "Time" };
        double columnWidth = contentWidth / 9;

        // Draw headers for each column
        for (int i = 0; i < headers.Length; i++)
        {
            graphics.DrawString(headers[i], headersFont, XBrushes.Black, 
                new XRect(LEFT_MARGIN + i * columnWidth, currentY, columnWidth, 20), 
                XStringFormats.TopLeft);
        }
        currentY += 20;

        // Draw a horizontal line
        graphics.DrawLine(new XPen(XColors.Gray, 0.5), LEFT_MARGIN, currentY, LEFT_MARGIN + contentWidth, currentY);
        currentY += 10;

        foreach (var eventItem in eventsData)
        {
            if (currentY > page.Height - BOTTOM_MARGIN)
            {
                page = document.AddPage();
                graphics = XGraphics.FromPdfPage(page);
                currentY = TOP_MARGIN;
            }

            string[] eventData = {
              eventItem.Title ?? "N/A",
              eventItem.CampusType ?? "N/A",
              eventItem.EventType ?? "N/A",
              eventItem.Location ?? "N/A",
              eventItem.HostedBy.Split(' ')[0] ?? "N/A",
              eventItem.Status ?? "N/A",
              eventItem.AttendeesCount.ToString() ?? "N/A",
              eventItem.DateStart.ToString("MM/dd/yyyy") + " - " + eventItem.DateEnd.ToString("MM/dd/yyyy")?? "N/A",
              FormatTimeSpan(eventItem.TimeStart) + " - " + FormatTimeSpan(eventItem.TimeEnd) ?? "N/A"
          };

          for (int i = 0; i < eventData.Length; i++)
          {
              graphics.DrawString(eventData[i], normalFont, XBrushes.Black,
                  new XRect(LEFT_MARGIN + i * columnWidth, currentY, columnWidth, 20),
                  XStringFormats.TopLeft);
          }
            currentY += 20;
        }

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