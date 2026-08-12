using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin,Manager")]
public class UploadController : ControllerBase
{
    private readonly IUploadService _uploadService;

    public UploadController(IUploadService uploadService)
    {
        _uploadService = uploadService;
    }

    [HttpPost]
    public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
    {
        try
        {
            using var stream = file.OpenReadStream();
            var url = await _uploadService.UploadFileAsync(stream, file.FileName, file.ContentType, "lms_uploads");
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
