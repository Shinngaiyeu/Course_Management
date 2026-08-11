using Application.Interfaces;
using Domain.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class SyncLogRepository : ISyncLogRepository
{
    private readonly AppDbContext _context;

    public SyncLogRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SyncLog?> GetByIdAsync(int id)
    {
        return await _context.SyncLogs.FindAsync(id);
    }

    public async Task<IEnumerable<SyncLog>> GetAllAsync()
    {
        return await _context.SyncLogs.ToListAsync();
    }

    public async Task AddAsync(SyncLog log)
    {
        await _context.SyncLogs.AddAsync(log);
        await _context.SaveChangesAsync();
    }
}
