namespace BackendProject.Models
{
  public class NotificationsDto
  {
    public int Id { get; set; }
    public int UserId { get; set; }
    public int EventId { get; set; }
    public string Type { get; set; } = string.Empty;
    public IFormFile? NotificationImage { get; set; } 
    public string Message { get; set; } = string.Empty;

    public string UserName { get; set; } = string.Empty;
    public string EventTitle { get; set; } = string.Empty;
    public string EventDesc { get; set; } = string.Empty;
    public string EventImage { get; set; } = string.Empty;
    public string EventLocation { get; set; } = string.Empty;
    public DateTime EventDate { get; set; } 
  }
}