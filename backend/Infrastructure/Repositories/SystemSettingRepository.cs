using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class SystemSettingRepository : ISystemSettingRepository
{
    private readonly AppDbContext _context;

    public SystemSettingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SystemSetting?> GetByKeyAsync(string key)
    {
        return await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == key);
    }

    public async Task<SystemSetting> AddAsync(SystemSetting setting)
    {
        _context.SystemSettings.Add(setting);
        await _context.SaveChangesAsync();
        return setting;
    }

    public async Task<SystemSetting> UpdateAsync(SystemSetting setting)
    {
        _context.SystemSettings.Update(setting);
        await _context.SaveChangesAsync();
        return setting;
    }
}
