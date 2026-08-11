using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SyncController : ControllerBase
{
    private readonly ISyncService _syncService;

    public SyncController(ISyncService syncService)
    {
        _syncService = syncService;
    }

    [HttpPost("hris-webhook")]
    public async Task<IActionResult> SyncUser([FromBody] SyncPayload payload)
    {
        var result = await _syncService.SyncUserAsync(payload);
        if (result)
        {
            return Ok(new { message = "Sync successful" });
        }
        return BadRequest(new { message = "Sync failed" });
    }
}
