using Application.DTOs;
using Application.Interfaces;
using Domain.Interfaces;
using Domain.Entities;

namespace Application.Services;

public class RoleService : IRoleService
{
    private readonly IRoleRepository _repository;

    public RoleService(IRoleRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<RoleDto>> GetAllRolesAsync()
    {
        var roles = await _repository.GetAllAsync();
        return roles.Select(r => new RoleDto { Id = r.Id, Name = r.Name });
    }

    public async Task<RoleDto?> GetRoleByIdAsync(int id)
    {
        var role = await _repository.GetByIdAsync(id);
        if (role == null) return null;
        return new RoleDto { Id = role.Id, Name = role.Name };
    }

    public async Task<RoleDto> CreateRoleAsync(CreateRoleDto dto)
    {
        var role = new Role { Name = dto.Name };
        await _repository.AddAsync(role);
        return new RoleDto { Id = role.Id, Name = role.Name };
    }

    public async Task<RoleDto?> UpdateRoleAsync(int id, UpdateRoleDto dto)
    {
        var role = await _repository.GetByIdAsync(id);
        if (role == null) return null;

        role.Name = dto.Name;
        await _repository.UpdateAsync(role);

        return new RoleDto { Id = role.Id, Name = role.Name };
    }

    public async Task<bool> DeleteRoleAsync(int id)
    {
        var role = await _repository.GetByIdAsync(id);
        if (role == null) return false;

        await _repository.DeleteAsync(id);
        return true;
    }
}
