using Application.DTOs;
using Application.Interfaces;
using Domain.Interfaces;
using Domain.Entities;
using System.Text.Json;

namespace Application.Services;

public class SyncService : ISyncService
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IDepartmentRepository _departmentRepository;
    private readonly ISyncLogRepository _syncLogRepository;

    public SyncService(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        IDepartmentRepository departmentRepository,
        ISyncLogRepository syncLogRepository)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _departmentRepository = departmentRepository;
        _syncLogRepository = syncLogRepository;
    }

    public async Task<bool> SyncUserAsync(SyncPayload payload)
    {
        var log = new SyncLog
        {
            Payload = JsonSerializer.Serialize(payload)
        };

        try
        {

            var department = await _departmentRepository.GetByNameAsync(payload.DepartmentName);
            if (department == null)
            {
                department = new Department { Name = payload.DepartmentName };
                await _departmentRepository.AddAsync(department);
            }

            var role = await _roleRepository.GetByNameAsync(payload.Role);
            if (role == null)
            {
                throw new Exception($"Role {payload.Role} does not exist.");
            }

            var user = await _userRepository.GetByUsernameAsync(payload.Username);
            if (user == null)
            {
                user = new User
                {
                    Id = Guid.NewGuid(),
                    Username = payload.Username,
                    Email = payload.Email,
                    DepartmentId = department.Id,
                    PasswordHash = "dummyhash"
                };

                user.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = role.Id });
                await _userRepository.AddAsync(user);
            }
            else
            {
                user.Email = payload.Email;
                user.DepartmentId = department.Id;
                user.UpdatedAt = DateTime.UtcNow;

                if (!user.UserRoles.Any(ur => ur.RoleId == role.Id))
                {
                    user.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = role.Id });
                }

                await _userRepository.UpdateAsync(user);
            }

            log.Status = "Success";
            log.Message = "User synced successfully";
        }
        catch (Exception ex)
        {
            log.Status = "Failed";
            log.Message = ex.Message;
        }

        await _syncLogRepository.AddAsync(log);

        return log.Status == "Success";
    }
}
