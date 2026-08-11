using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] UserQueryParameters query)
    {
        var pagedUsers = await _service.GetPagedUsersAsync(query);
        return Ok(pagedUsers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await _service.GetUserByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        var user = await _service.CreateUserAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserDto dto)
    {
        var user = await _service.UpdateUserAsync(id, dto);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Patch(Guid id, [FromBody] UpdateUserDto dto)
    {
        var user = await _service.UpdateUserAsync(id, dto);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _service.DeleteUserAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpPost("{id}/roles/{roleId}")]
    public async Task<IActionResult> AssignRole(Guid id, int roleId)
    {
        var success = await _service.AssignRoleAsync(id, roleId);
        if (!success) return BadRequest("Could not assign role.");
        return Ok();
    }

    [HttpDelete("{id}/roles/{roleId}")]
    public async Task<IActionResult> RemoveRole(Guid id, int roleId)
    {
        var success = await _service.RemoveRoleAsync(id, roleId);
        if (!success) return BadRequest("Could not remove role.");
        return NoContent();
    }
}
