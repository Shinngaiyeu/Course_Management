using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager,Learner")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CoursesController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<CourseDto>>> GetAllCourses(
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10, 
        [FromQuery] string? searchTerm = null)
    {
        bool isLearner = User.IsInRole("Learner");
        bool isManager = User.IsInRole("Manager");

        int? departmentId = null;
        if (isManager)
        {
            var deptClaim = User.FindFirst("DepartmentId")?.Value;
            if (deptClaim != null) departmentId = int.Parse(deptClaim);
        }

        var result = await _courseService.GetPagedCoursesAsync(pageNumber, pageSize, searchTerm, departmentId, isLearner);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CourseDto>> GetCourse(int id)
    {
        var course = await _courseService.GetCourseByIdAsync(id);
        if (course == null) return NotFound();
        return Ok(course);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<CourseDto>> CreateCourse([FromBody] CreateCourseDto dto)
    {
        var deptClaim = User.FindFirst("DepartmentId")?.Value;
        int? departmentId = deptClaim != null ? int.Parse(deptClaim) : null;

        var created = await _courseService.CreateCourseAsync(dto, departmentId);
        return CreatedAtAction(nameof(GetCourse), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<CourseDto>> UpdateCourse(int id, [FromBody] UpdateCourseDto dto)
    {
        try
        {
            var updated = await _courseService.UpdateCourseAsync(id, dto);
            return Ok(updated);
        }
        catch
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult> DeleteCourse(int id)
    {
        try
        {
            await _courseService.DeleteCourseAsync(id);
            return NoContent();
        }
        catch
        {
            return NotFound();
        }
    }
}
