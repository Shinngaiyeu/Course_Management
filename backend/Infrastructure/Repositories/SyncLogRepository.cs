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

    public async Task<(IEnumerable<SyncLog> Items, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, string? status = null)
    {
        var query = _context.SyncLogs.AsQueryable();

        if (!string.IsNullOrEmpty(status) && status != "All")
        {
            query = query.Where(l => l.Status == status);
        }

        int totalCount = await query.CountAsync();
        
        var items = await query
            .OrderByDescending(l => l.SyncDate)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task AddAsync(SyncLog log)
    {
        await _context.SyncLogs.AddAsync(log);
        await _context.SaveChangesAsync();
    }
}
