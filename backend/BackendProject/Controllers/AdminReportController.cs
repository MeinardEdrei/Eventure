using Microsoft.AspNetCore.Mvc;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using BackendProject.Models;
using BackendProject.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json.Serialization;
using System.Collections.Immutable;

namespace BackendProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminReportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        private const float LEFT_MARGIN = 35;
        private const float RIGHT_MARGIN = 35;
        private const float TOP_MARGIN = 35;
        private const float BOTTOM_MARGIN = 35;

        public AdminReportController(ApplicationDbContext context)
        {
            _context = context;
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
        public async Task<IActionResult> ExportEvents()
        {
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
              graphics.DrawString("Event Name", titleFont, XBrushes.Black,
                  new XRect(LEFT_MARGIN, currentY, contentWidth / 3, 20), XStringFormats.TopLeft);
              graphics.DrawString("Date", titleFont, XBrushes.Black,
                  new XRect(LEFT_MARGIN + contentWidth / 3, currentY, contentWidth / 3, 20), XStringFormats.TopLeft);
              graphics.DrawString("Location", titleFont, XBrushes.Black,
                  new XRect(LEFT_MARGIN + 2 * contentWidth / 3, currentY, contentWidth / 3, 20), XStringFormats.TopLeft);
              
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