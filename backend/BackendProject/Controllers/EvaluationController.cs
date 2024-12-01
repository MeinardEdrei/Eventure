using BackendProject.Data;
using Microsoft.AspNetCore.Mvc;

namespace BackendProject.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class EvaluationController : Controller
  {
    private readonly ApplicationDbContext _context;

    public EvaluationController(ApplicationDbContext context)
    {
      _context = context;
    }

    
  }
}