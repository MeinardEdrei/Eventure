using System;
using System.Collections.Generic;

namespace BackendProject.Models;

public partial class Event
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime Date { get; set; }

    public TimeSpan Start { get; set; }

    public TimeSpan End { get; set; }

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

    // Eager Loading Navigatiion Props
    public ICollection<UEvent> UserEvents { get; set; } = new List<UEvent>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
