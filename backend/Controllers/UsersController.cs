using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserDto userDto)
    {
        var result = await _userService.RegisterUserAsync(userDto);
        if (result.IsSuccess)
        {
            return Ok(new { success = true, message = "Registration successful!" });
        }
        return BadRequest(new { success = false, message = result.Message });
    }
}
