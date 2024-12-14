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
    private const float LEFT_MARGIN = 25;
    private const float RIGHT_MARGIN = 25;
    private const float TOP_MARGIN = 15;
    private const float BOTTOM_MARGIN = 15;
    
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
            filteredLabels = labels.Skip(7).Concat(labels.Take(1)).ToList();
            filteredData = dataArrays.Select(dataArray => dataArray.Skip(7).Concat(dataArray.Take(1)).ToList()).ToList();
        }
        else if (semester == "Second")
        {
            filteredLabels = labels.Take(7).ToList();
            filteredData = dataArrays.Select(dataArray => dataArray.Take(7).ToList()).ToList();
        }
        else if (semester == "FirstAndSecond")
        {
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

        var eventsQuery = _context.Events
            .Include(e => e.SchoolYear)
            .Where(e => e.OrganizerId == id)
            .Select(e => new
            {
                EventId = e.Id,
                Status = e.Status,
                SchoolYear = e.SchoolYear != null
                    ? $"{e.SchoolYear.DateStart.Year}-{e.SchoolYear.DateEnd.Year}"
                    : "Unknown School Year",
                Semester = e.Semester,
                HostedBy = !string.IsNullOrEmpty(e.HostedBy)
                    ? string.Join(", ", JsonConvert.DeserializeObject<List<string>>(e.HostedBy))
                    : string.Empty,
                DateStart = e.DateStart,
                TimeStart = e.TimeStart,
                AttendeesCount = e.AttendeesCount,
                CampusType = e.CampusType
            });

        var eventsData = await eventsQuery.ToListAsync();

        // Apply filters
        if (!string.IsNullOrEmpty(schoolYearFilter))
        {
            eventsData = eventsData.Where(e => e.SchoolYear == schoolYearFilter).ToList();
        }

        if (!string.IsNullOrEmpty(semesterFilter))
        {
            if (semesterFilter == "FirstAndSecond")
            {
                eventsData = eventsData.Where(e => e.Semester == "First" || e.Semester == "Second").ToList();
            }
            else
            {
                eventsData = eventsData.Where(e => e.Semester == semesterFilter).ToList();
            }
        }

        /* STATUS COUNTS */
        var statusCounts = new int[]
        {
            eventsData.Count(e => e.Status == "Pending"),
            eventsData.Count(e => e.Status == "Pre-Approved"),
            eventsData.Count(e => e.Status == "Approved"),
            eventsData.Count(e => e.Status == "Modified"),
            eventsData.Count(e => e.Status == "Rejected")
        };

        /* UPCOMING EVENTS */
        var now = DateTime.Now;
        var upcomingCount = eventsData
            .Where(e => e.DateStart != null && e.TimeStart != null)
            .Count(e => e.DateStart.Add(e.TimeStart) > now);

        /* MONTHLY ENGAGEMENTS */
        var currentMonth = now.Month;
        var currentYear = now.Year;

        var eventsInCurrentMonth = eventsData
            .Where(e => e.DateStart.Year == currentYear && e.DateStart.Month == currentMonth)
            .ToList();

        var totalAttendees = eventsInCurrentMonth.Sum(e => e.AttendeesCount);
        var totalEvents = eventsInCurrentMonth.Count;
        var monthlyEngagementCount = totalEvents > 0 ? totalAttendees / totalEvents : 0;

        /* CREATED EVENTS */
        var totalEventsCreated = await _context.Users
            .Where(u => u.Id == id)
            .Select(u => u.Created_Events)
            .FirstOrDefaultAsync();

        /* EVENTS COUNTS */
        var eventCounts = new int[12];
        var onCampusCounts = new int[12];
        var offCampusCounts = new int[12];

        foreach (var e in eventsData)
        {
            if (e.DateStart != null && e.TimeStart != null)
            {
                var monthIndex = e.DateStart.Month - 1;
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
            MonthlyEngagement = monthlyEngagementCount
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

      var departmentFilter = await _context.Users
        .Where(u => u.Id == id)
        .Select(u => u.Department) // Adjust 'Department' to your actual column name
        .FirstOrDefaultAsync();

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
      var disapprovedCount = eventsData.Count(e => e.Status == "Rejected");

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