using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SyncController : ControllerBase
{
    private readonly ISyncService _syncService;
    private readonly ISystemSettingService _settingService;

    public SyncController(ISyncService syncService, ISystemSettingService settingService)
    {
        _syncService = syncService;
        _settingService = settingService;
    }

    [HttpPost("{path}")]
    public async Task<IActionResult> SyncUser(string path, [FromBody] SyncPayload payload)
    {
        var configuredPath = await _settingService.GetWebhookPathAsync();
        if (path != configuredPath)
        {
            return NotFound();
        }

        var (success, message) = await _syncService.SyncUserAsync(payload);
        if (success)
        {
            return Ok(new { message = "Sync successful" });
        }
        return BadRequest(new { message = message });
    }
}
