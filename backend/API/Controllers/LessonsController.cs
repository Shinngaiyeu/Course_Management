using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager")]
public class LessonsController : ControllerBase
{
    private readonly ICourseService _courseService;

    public LessonsController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpPost]
    public async Task<ActionResult<LessonDto>> CreateLesson([FromBody] CreateLessonDto dto)
    {
        var created = await _courseService.CreateLessonAsync(dto);
        return Ok(created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<LessonDto>> UpdateLesson(int id, [FromBody] UpdateLessonDto dto)
    {
        try
        {
            var updated = await _courseService.UpdateLessonAsync(id, dto);
            return Ok(updated);
        }
        catch
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteLesson(int id)
    {
        try
        {
            await _courseService.DeleteLessonAsync(id);
            return NoContent();
        }
        catch
        {
            return NotFound();
        }
    }
}
