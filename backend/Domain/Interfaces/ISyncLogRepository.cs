using Domain.Entities;

namespace Domain.Interfaces;

public interface ISyncLogRepository
{
    Task<SyncLog?> GetByIdAsync(int id);
    Task<(IEnumerable<SyncLog> Items, int TotalCount)> GetPagedAsync(int pageNumber, int pageSize, string? status = null);
    Task AddAsync(SyncLog log);
}
