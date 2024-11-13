using Microsoft.EntityFrameworkCore;
using BackendProject.Models;

namespace BackendProject.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<RForm> RForms { get; set; }
        public DbSet<UEvent> UEvents { get; set; }
    }
}