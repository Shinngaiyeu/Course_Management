using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentService _service;

    public DepartmentsController(IDepartmentService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var deps = await _service.GetAllDepartmentsAsync();
        return Ok(deps);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var dep = await _service.GetDepartmentByIdAsync(id);
        if (dep == null) return NotFound();
        return Ok(dep);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDepartmentDto dto)
    {
        var dep = await _service.CreateDepartmentAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = dep.Id }, dep);
    }

    [HttpPut("{id}")]
    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateDepartmentDto dto)
    {
        var dep = await _service.UpdateDepartmentAsync(id, dto);
        if (dep == null) return NotFound();
        return Ok(dep);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteDepartmentAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
