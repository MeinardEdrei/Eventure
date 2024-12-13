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
        public required DbSet<RejectionReason> RejectionReasons { get; set; }
        public required DbSet<RForm> RForms { get; set; }
        public required DbSet<UEvent> UEvents { get; set; }
        public required DbSet<Notification> Notifications { get; set; }
        public required DbSet<EvaluationForm> EvaluationForms { get; set; }
        public required DbSet<EvaluationQuestion> EvaluationQuestions { get; set; }
        public required DbSet<EvaluationAnswer> EvaluationAnswers { get; set; }
        public required DbSet<SchoolYear> SchoolYears { get; set; }

        // REGISTRATION FORM,
        // USER EVENTS relationship to EVENTS TABLE
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Event>()
                .HasMany(e => e.RForms)
                .WithOne(r => r.Event)
                .HasForeignKey(r => r.Event_Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RForm>()
                .HasMany(e => e.UEvents)
                .WithOne(r => r.RForm)
                .HasForeignKey(r => r.RForm_Id)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
            SeedData(modelBuilder);
        }

        // AUTOMATE ADMIN ACCOUNT CREATION
        private void SeedData(ModelBuilder modelBuilder)
        {
            try 
            {
                var seedUser = new User
                {
                    Id = 1,
                    Username = Environment.GetEnvironmentVariable("ADMIN_USERNAME") ?? String.Empty,
                    Email = Environment.GetEnvironmentVariable("ADMIN_EMAIL") ?? String.Empty,
                    Student_Number = Environment.GetEnvironmentVariable("ADMIN_NUMBER") ?? String.Empty,
                    Section = Environment.GetEnvironmentVariable("ADMIN_SECTION") ?? String.Empty,
                    Department = Environment.GetEnvironmentVariable("ADMIN_DEPARTMENT") ?? String.Empty,
                    Password = BCrypt.Net.BCrypt.HashPassword(
                        Environment.GetEnvironmentVariable("ADMIN_SECRET")) ?? String.Empty,
                    Role = Environment.GetEnvironmentVariable("ADMIN_ROLE") ?? String.Empty,
                    Status = Environment.GetEnvironmentVariable("ADMIN_STATUS") ?? String.Empty,
                    Profile_Image = String.Empty,
                    Attended_Events = 0,
                    Created_Events = 0,
                    Created_At = DateTime.Now
                };

                modelBuilder.Entity<User>().HasData(seedUser);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SeedData: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            }
        }
    }
}