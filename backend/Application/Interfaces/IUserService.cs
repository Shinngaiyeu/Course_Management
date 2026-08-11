using Application.DTOs;

namespace Application.Interfaces;

public interface IUserService
{
    Task<PagedResult<UserDto>> GetPagedUsersAsync(UserQueryParameters query);
    Task<UserDto?> GetUserByIdAsync(Guid id);
    Task<UserDto> CreateUserAsync(CreateUserDto dto);
    Task<UserDto?> UpdateUserAsync(Guid id, UpdateUserDto dto);
    Task<bool> DeleteUserAsync(Guid id);
    Task<bool> AssignRoleAsync(Guid userId, int roleId);
    Task<bool> RemoveRoleAsync(Guid userId, int roleId);
}
