using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;


namespace BackendProject.Models
{
    public class GoogleSheetsDto
    {
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string SchoolId { get; set; }
    public required string Section { get; set; }
    }
}