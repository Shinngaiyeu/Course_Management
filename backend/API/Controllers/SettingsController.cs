using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class SettingsController : ControllerBase
{
    private readonly ISystemSettingService _settingService;

    public SettingsController(ISystemSettingService settingService)
    {
        _settingService = settingService;
    }

    public class UpdateWebhookPathDto
    {
        public string Path { get; set; } = string.Empty;
    }

    [HttpGet("webhook-path")]
    public async Task<IActionResult> GetWebhookPath()
    {
        var path = await _settingService.GetWebhookPathAsync();
        return Ok(new { path });
    }

    [HttpPut("webhook-path")]
    public async Task<IActionResult> UpdateWebhookPath([FromBody] UpdateWebhookPathDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Path))
        {
            return BadRequest("Path cannot be empty.");
        }

        await _settingService.UpdateWebhookPathAsync(dto.Path);
        return Ok(new { message = "Webhook path updated successfully." });
    }
}
