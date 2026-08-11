using Application.DTOs;
using Application.Interfaces;
using Domain.Interfaces;
using Domain.Entities;

namespace Application.Services;

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _repository;

    public DepartmentService(IDepartmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync()
    {
        var deps = await _repository.GetAllAsync();
        return deps.Select(d => new DepartmentDto { Id = d.Id, Name = d.Name, Description = d.Description });
    }

    public async Task<DepartmentDto?> GetDepartmentByIdAsync(int id)
    {
        var d = await _repository.GetByIdAsync(id);
        if (d == null) return null;
        return new DepartmentDto { Id = d.Id, Name = d.Name, Description = d.Description };
    }

    public async Task<DepartmentDto> CreateDepartmentAsync(CreateDepartmentDto dto)
    {
        var dep = new Department { Name = dto.Name, Description = dto.Description };
        await _repository.AddAsync(dep);
        return new DepartmentDto { Id = dep.Id, Name = dep.Name, Description = dep.Description };
    }

    public async Task<DepartmentDto?> UpdateDepartmentAsync(int id, UpdateDepartmentDto dto)
    {
        var dep = await _repository.GetByIdAsync(id);
        if (dep == null) return null;

        dep.Name = dto.Name;
        if (dto.Description != null) dep.Description = dto.Description;
        
        await _repository.UpdateAsync(dep);

        return new DepartmentDto { Id = dep.Id, Name = dep.Name, Description = dep.Description };
    }

    public async Task<bool> DeleteDepartmentAsync(int id)
    {
        var dep = await _repository.GetByIdAsync(id);
        if (dep == null) return false;

        await _repository.DeleteAsync(id);
        return true;
    }
}
