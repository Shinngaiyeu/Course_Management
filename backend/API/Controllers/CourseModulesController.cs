using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager")]
public class CourseModulesController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CourseModulesController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpPost]
    public async Task<ActionResult<CourseModuleDto>> CreateModule([FromBody] CreateCourseModuleDto dto)
    {
        var created = await _courseService.CreateModuleAsync(dto);
        return Ok(created);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CourseModuleDto>> UpdateModule(int id, [FromBody] UpdateCourseModuleDto dto)
    {
        try
        {
            var updated = await _courseService.UpdateModuleAsync(id, dto);
            return Ok(updated);
        }
        catch
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteModule(int id)
    {
        try
        {
            await _courseService.DeleteModuleAsync(id);
            return NoContent();
        }
        catch
        {
            return NotFound();
        }
    }
}
