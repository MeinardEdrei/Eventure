using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;


namespace BackendProject.Models
{
    public class ExcelSheetsDto
    {
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string SchoolId { get; set; }
    public required string Section { get; set; }
    public required string EventId { get; set; }
    public required string EventTitle { get; set; }
    public required DateTime RegisteredTime { get; set; }
    }
}