using BackendProject.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotEnv.Core;

new EnvLoader().Load();

var builder = WebApplication.CreateBuilder(args);

// Register controllers
builder.Services.AddControllers();

// Register Email Service
builder.Services.AddScoped<EmailService>();

// Connect to the MySQL Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"), // Default Connection is from appsettings.json
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS Config
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        builder => builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// JWT Config
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"])
            )
        };
    });

// builder.Services.AddScoped<UserService>(); // User Service

var app = builder.Build();

app.UseStaticFiles(); // file handling
app.UseCors("AllowLocalhost"); // CORS

// HTTP request pipeline config
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable routing and controllers
app.UseRouting();
app.UseAuthorization(); // IMPORTANT for auth
app.UseAuthentication(); // IMPORTANT for auth
app.MapControllers();

// Run migrations and hash passwords
// FOR HASHING PASSWORDS
// using (var scope = app.Services.CreateScope())
// {
//     var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
//     await MigrateDatabaseAndHashPasswords(context);
// }

// --------- FOR TEST RUN SERVER

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

// FOR HASHING PASSWORDS
// static async Task MigrateDatabaseAndHashPasswords(ApplicationDbContext context)
// {
//     // Ensure the database is created
//     await context.Database.MigrateAsync();

//     // Fetch all users with plain text passwords
//     var users = await context.Users.ToListAsync();

//     foreach (var user in users)
//     {
//         if (!string.IsNullOrEmpty(user.Password) && !user.Password.StartsWith("$2a$")) // Check if password is not hashed
//         {
//             // Hash the plain text password
//             var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
//             user.Password = hashedPassword; // Update the password

//             // Save changes to the database
//             context.Users.Update(user);
//         }
//     }

//     await context.SaveChangesAsync();
//     Console.WriteLine("Passwords have been hashed and updated successfully.");
// }

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
