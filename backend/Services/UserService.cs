using BCrypt.Net;

public class UserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceResult> RegisterUserAsync(UserDto userDto)
    {
        // Check if email already exists
        if (_context.Users.Any(u => u.Email == userDto.Email))
        {
            return new ServiceResult { IsSuccess = false, Message = "Email already exists." };
        }

        // Hash the password
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        // Save user data to the database
        var user = new User
        {
            Username = userDto.Username,
            Email = userDto.Email,
            Password = hashedPassword,
            Role = "user",  // Default role
            Status = "pending"  // Default status
        };
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new ServiceResult { IsSuccess = true, Message = "User registered successfully." };
    }
}
