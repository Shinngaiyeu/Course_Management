using Domain.Entities;

namespace Domain.Interfaces;

public interface ISystemSettingRepository
{
    Task<SystemSetting?> GetByKeyAsync(string key);
    Task<SystemSetting> AddAsync(SystemSetting setting);
    Task<SystemSetting> UpdateAsync(SystemSetting setting);
}
