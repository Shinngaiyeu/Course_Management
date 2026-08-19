using Application.DTOs;
using Application.Interfaces;
using Domain.Interfaces;
using Domain.Entities;

namespace Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly IRoleRepository _roleRepository;
    private readonly IDepartmentRepository _departmentRepository;

    public UserService(
        IUserRepository repository,
        IRoleRepository roleRepository,
        IDepartmentRepository departmentRepository)
    {
        _repository = repository;
        _roleRepository = roleRepository;
        _departmentRepository = departmentRepository;
    }

    public async Task<PagedResult<UserDto>> GetPagedUsersAsync(UserQueryParameters query)
    {
        var (items, totalCount) = await _repository.GetPagedAsync(
            query.PageNumber,
            query.PageSize,
            query.DepartmentId,
            query.SearchTerm);

        return new PagedResult<UserDto>
        {
            Items = items.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid id)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null) return null;
        return MapToDto(user);
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = dto.Password,
            DepartmentId = dto.DepartmentId,
            IsActive = true
        };

        if (dto.RoleIds != null && dto.RoleIds.Any())
        {
            foreach (var roleId in dto.RoleIds)
            {
                user.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = roleId });
            }
        }

        await _repository.AddAsync(user);

        var savedUser = await _repository.GetByIdAsync(user.Id);
        return MapToDto(savedUser!);
    }

    public async Task<UserDto?> UpdateUserAsync(Guid id, UpdateUserDto dto)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null) return null;

        if (dto.Email != null) user.Email = dto.Email;
        if (dto.DepartmentId.HasValue) user.DepartmentId = dto.DepartmentId.Value;
        if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;

        user.UpdatedAt = DateTime.UtcNow;
        await _repository.UpdateAsync(user);

        if (dto.RoleIds != null)
        {
            await _repository.UpdateUserRolesAsync(user.Id, dto.RoleIds);
            
            user = await _repository.GetByIdAsync(user.Id);
        }

        return MapToDto(user!);
    }

    public async Task<bool> DeleteUserAsync(Guid id)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null) return false;

        await _repository.DeleteAsync(id);
        return true;
    }

    public async Task<bool> AssignRoleAsync(Guid userId, int roleId)
    {
        var user = await _repository.GetByIdAsync(userId);
        var role = await _roleRepository.GetByIdAsync(roleId);

        if (user == null || role == null) return false;

        if (!user.UserRoles.Any(ur => ur.RoleId == roleId))
        {
            user.UserRoles.Add(new UserRole { UserId = userId, RoleId = roleId });
            await _repository.UpdateAsync(user);
        }
        return true;
    }

    public async Task<bool> RemoveRoleAsync(Guid userId, int roleId)
    {
        var user = await _repository.GetByIdAsync(userId);
        if (user == null) return false;

        var userRole = user.UserRoles.FirstOrDefault(ur => ur.RoleId == roleId);
        if (userRole != null)
        {
            user.UserRoles.Remove(userRole);
            await _repository.UpdateAsync(user);
        }
        return true;
    }

    private UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            DepartmentId = user.DepartmentId,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            Department = user.Department != null ? new DepartmentDto { Id = user.Department.Id, Name = user.Department.Name } : null,
            Roles = user.UserRoles?.Select(ur => new RoleDto { Id = ur.Role.Id, Name = ur.Role.Name }).ToList() ?? new List<RoleDto>()
        };
    }
}
