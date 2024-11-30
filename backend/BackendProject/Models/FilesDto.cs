namespace BackendProject.Models
{
  public class FilesDto 
  {
    public string Filename { get; set; } = null!;
    public string Filetype { get; set; } = null!;
    public string Filesize { get; set; } = null!;
    public int EventId { get; set; }
  }
}