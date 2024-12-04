using Microsoft.AspNetCore.Mvc;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using BackendProject.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json.Serialization;

namespace BackendProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        private const float LEFT_MARGIN = 40;
        private const float RIGHT_MARGIN = 40;
        private const float TOP_MARGIN = 25;
        private const float BOTTOM_MARGIN = 25;

        public TicketController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class GeneratePdfRequest
        {
            public int UserId { get; set; }
            public int EventId { get; set; }
        }

        [HttpGet("{id}/my-ticket")]
        public async Task<IActionResult> GetTicket(int id)
        {
            var ticketDetails = await _context.RForms
                .Where(e => e.User_Id == id)
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

        // Proper Alignment
        private void DrawMultilineText(XGraphics graphics, string text, XFont font, XRect rect)
        {
            string[] words = text.Split(' ');
            StringBuilder line = new StringBuilder();
            double lineHeight = font.Height;
            double currentY = rect.Y;

            foreach (string word in words)
            {
                string testLine = line.Length == 0 ? word : line + " " + word;
                XSize size = graphics.MeasureString(testLine, font);

                if (size.Width > rect.Width && line.Length > 0)
                {
                    // Draw the current line
                    graphics.DrawString(line.ToString(), font, XBrushes.Black,
                        new XRect(rect.X, currentY, rect.Width, lineHeight),
                        XStringFormats.TopLeft);
                    
                    currentY += lineHeight;
                    line.Clear();
                    line.Append(word);
                }
                else
                {
                    line = line.Length == 0 ? new StringBuilder(word) : line.Append(" ").Append(word);
                }
            }

            // Draw the last line
            if (line.Length > 0)
            {
                graphics.DrawString(line.ToString(), font, XBrushes.Black,
                    new XRect(rect.X, currentY, rect.Width, lineHeight),
                    XStringFormats.TopLeft);
            }
        }
        // Time Format
        private string FormatTimeSpan(TimeSpan time)
        {
            var hours = time.Hours % 12; // Convert to 12-hour format
            var period = time.Hours >= 12 ? "PM" : "AM"; // Determine AM/PM

            // Ensure 2-digit minutes
            var formattedTime = string.Format("{0:D2}:{1:D2} {2}", hours == 0 ? 12 : hours, time.Minutes, period);
            return formattedTime;
        }

        [HttpPost("download")]
        public async Task<IActionResult> GeneratePdf([FromBody] GeneratePdfRequest request)
        {
            try
            {
                // Fetch ticket details from the database
                var eventDetails = await _context.Events
                    .FirstOrDefaultAsync(e => e.Id == request.EventId);  

                var userDetails = await _context.RForms
                    .FirstOrDefaultAsync(e => e.User_Id == request.UserId);

                if (eventDetails == null || userDetails == null)
                {
                    return NotFound($"Event with ID {request.EventId} not found.");
                }

                using var document = new PdfDocument();
                var page = document.AddPage();
                var graphics = XGraphics.FromPdfPage(page);
                
                // First gradient (from top to middle)
                var gradientBrush1 = new XLinearGradientBrush(
                    new XPoint(0, 0),                            
                    new XPoint(0, page.Height / 2),             
                    XColor.FromArgb(248, 230, 242),              
                    XColor.FromArgb(214, 234, 248)              
                );

                // Second gradient (from middle to bottom)
                var gradientBrush2 = new XLinearGradientBrush(
                    new XPoint(0, page.Height / 2),              
                    new XPoint(0, page.Height),                  
                    XColor.FromArgb(214, 234, 248),              
                    XColor.FromArgb(250, 219, 216)               
                );

                // Draw the first gradient (top to middle)
                graphics.DrawRectangle(gradientBrush1, new XRect(0, 0, page.Width, page.Height / 2));

                // Draw the second gradient (middle to bottom)
                graphics.DrawRectangle(gradientBrush2, new XRect(0, page.Height / 2, page.Width, page.Height / 2));

                double contentWidth = page.Width - LEFT_MARGIN - RIGHT_MARGIN;
                var titleFont = new XFont("Arial", 21, XFontStyle.Bold);
                var subTitleFont = new XFont("Arial", 15, XFontStyle.Bold);
                var normalFont = new XFont("Arial", 14, XFontStyle.Regular);

                float yPosition = TOP_MARGIN;
                
                // Ticket Text
                graphics.DrawString("TICKET", normalFont, XBrushes.Gray, 
                    new XRect(LEFT_MARGIN, yPosition, contentWidth, 30), 
                    XStringFormats.TopLeft);
                
                yPosition += 40;
                
                // Define different fonts
                // Title with proper word wrap
                var titleRect = new XRect(
                    LEFT_MARGIN, 
                    yPosition, 
                    contentWidth,
                    page.Height - yPosition - BOTTOM_MARGIN
                );

                DrawMultilineText(graphics, eventDetails.Title, titleFont, titleRect);
                
                /* Date and Time */
                yPosition += 90;
                var DateStart = eventDetails.DateStart.ToString("MMMM dd, yyyy");
                var TimeStart = FormatTimeSpan(eventDetails.TimeStart); 
                var TimeEnd = FormatTimeSpan(eventDetails.TimeEnd);
                graphics.DrawString($"{DateStart}, {TimeStart} - {TimeEnd}", 
                    normalFont, XBrushes.Gray, 
                    new XRect(LEFT_MARGIN, yPosition, contentWidth, 20), 
                    XStringFormats.TopLeft);
                
                /* Location */
                yPosition += 20;
                graphics.DrawString($"{eventDetails.Location}", 
                    normalFont, XBrushes.Gray, 
                    new XRect(LEFT_MARGIN, yPosition, contentWidth, 20), 
                    XStringFormats.TopLeft);

                /* Dotted Line Set Up */
                yPosition += 40;
                var dottedPen = new XPen(XColors.Gray, 1);
                dottedPen.DashStyle = XDashStyle.Dot;
                graphics.DrawLine(dottedPen, LEFT_MARGIN, yPosition, LEFT_MARGIN + contentWidth, yPosition);

                /* QR COde */
                yPosition += 25;
                
                // Decode base64 ticket to image
                var base64Ticket = $"{userDetails.Ticket}";
                var qrImageBytes = Convert.FromBase64String(base64Ticket);

                using var qrImageStream = new MemoryStream(qrImageBytes);
                var qrImage = XImage.FromStream(() => new MemoryStream(qrImageBytes)); // Provide a function that returns a new MemoryStream

                // Draw QR code on the PDF
                float qrCodeSize = 385;
                float qrCodeX = (float)((page.Width - qrCodeSize) / 2); // Adjust position
                float qrCodeY = yPosition; // Adjust vertical spacing

                graphics.DrawImage(qrImage, qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

                yPosition += 400;
                graphics.DrawLine(dottedPen, LEFT_MARGIN, yPosition, LEFT_MARGIN + contentWidth, yPosition);

                yPosition += 20;
                graphics.DrawString("Guest", 
                    subTitleFont, XBrushes.Gray, 
                    new XRect(LEFT_MARGIN, yPosition, contentWidth, 20), 
                    XStringFormats.TopLeft);
                
                graphics.DrawString("Student Number", 
                    subTitleFont, XBrushes.Gray, 
                    new XRect(LEFT_MARGIN + 70, yPosition, contentWidth, 20), 
                    XStringFormats.TopCenter);

                yPosition += 25;
                graphics.DrawString($"{userDetails.Name}", 
                    subTitleFont, XBrushes.Black, 
                    new XRect(LEFT_MARGIN, yPosition, contentWidth, 20), 
                    XStringFormats.TopLeft);
                
                graphics.DrawString($"{userDetails.School_Id}", 
                    subTitleFont, XBrushes.Black, 
                    new XRect(LEFT_MARGIN + 50, yPosition, contentWidth, 20), 
                    XStringFormats.TopCenter);
                
                yPosition += 50;
                graphics.DrawString("Section", 
                    subTitleFont, XBrushes.Gray, 
                    new XRect(LEFT_MARGIN, yPosition, contentWidth, 20), 
                    XStringFormats.TopLeft);
                
                graphics.DrawString("Status", 
                    subTitleFont, XBrushes.Gray, 
                    new XRect(LEFT_MARGIN + 32, yPosition, contentWidth, 20), 
                    XStringFormats.TopCenter);

                yPosition += 25;
                graphics.DrawString($"{userDetails.Section}", 
                    subTitleFont, XBrushes.Black, 
                    new XRect(LEFT_MARGIN, yPosition, contentWidth, 20), 
                    XStringFormats.TopLeft);
                
                graphics.DrawString($"{userDetails.Status}", 
                    subTitleFont, XBrushes.Green, 
                    new XRect(LEFT_MARGIN + 30, yPosition, contentWidth, 20), 
                    XStringFormats.TopCenter);

                yPosition += 45;
                graphics.DrawLine(dottedPen, LEFT_MARGIN, yPosition, LEFT_MARGIN + contentWidth, yPosition);
                
                using var stream = new MemoryStream();
                document.Save(stream, false);
                
                string fileName = string.Join("_", userDetails.School_Id);

                return File(stream.ToArray(), "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating PDF: {ex}");
                return StatusCode(500, "An error occurred while generating the PDF.");
            }
        }
    }
}