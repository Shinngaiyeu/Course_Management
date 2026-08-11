using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SyncLogsController : ControllerBase
{
    private readonly ISyncLogService _service;

    public SyncLogsController(ISyncLogService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var logs = await _service.GetAllLogsAsync();
        return Ok(logs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var log = await _service.GetLogByIdAsync(id);
        if (log == null) return NotFound();
        return Ok(log);
    }
}
