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
    public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? status = null)
    {
        var result = await _service.GetPagedLogsAsync(pageNumber, pageSize, status);
        return Ok(result);
    }

    [HttpPost("{id}/retry")]
    public async Task<IActionResult> Retry(int id)
    {
        var success = await _service.RetrySyncLogAsync(id);
        if (success)
            return Ok(new { success = true });
        else
            return BadRequest(new { success = false, message = "Retry failed" });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var log = await _service.GetLogByIdAsync(id);
        if (log == null) return NotFound();
        return Ok(log);
    }
}
