using Microsoft.EntityFrameworkCore;
using BackendProject.Models;

namespace BackendProject.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public required DbSet<User> Users { get; set; }
        public required DbSet<Event> Events { get; set; }
        public required DbSet<RForm> RForms { get; set; }
        public required DbSet<UEvent> UEvents { get; set; }
        public required DbSet<Notification> Notifications { get; set; }
        public required DbSet<EvaluationForm> EvaluationForms { get; set; }
        public required DbSet<EvaluationQuestion> EvaluationQuestions { get; set; }
        public required DbSet<EvaluationAnswer> EvaluationAnswers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Event>()
                .HasMany(e => e.RForms)
                .WithOne(r => r.Event)
                .HasForeignKey(r => r.Event_Id)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}