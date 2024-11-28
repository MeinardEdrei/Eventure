using System;
using System.Collections.Generic;

namespace BackendProject.Models;

public partial class PastEvent
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int EventId { get; set; }
}
