using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendProject.Models;

public partial class Event
{
    public int Id { get; set; }
    public int SchoolYearId { get; set; }
    public string Semester { get; set; } = null!;
    public string CampusType { get; set; } = null!;
    public string EventType { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime DateStart { get; set; }
    public DateTime DateEnd { get; set; }
    public TimeSpan TimeStart { get; set; }
    public TimeSpan TimeEnd { get; set; }
    public string Location { get; set; } = null!;
    public int MaxCapacity { get; set; }
    public string HostedBy { get; set; } = null!;
    public string Visibility { get; set; } = null!;
    public bool RequireApproval { get; set; }
    public string Partnerships { get; set; } = null!;
    public string EventImage { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public int OrganizerId { get; set; }
    public string Status { get; set; } = null!;
    public int AttendeesCount { get; set; }
    public string RequirementFiles { get; set;} = null!;

    [ForeignKey("SchoolYearId")]
    public SchoolYear? SchoolYear { get; set; }

    // Eager Loading Navigatiion Props
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<RForm> RForms { get; set; } = new List<RForm>();
    public ICollection<RejectionReason> RejectionReasons { get; set; } = new List<RejectionReason>();
}
