using Domain.Entities;

namespace Domain.Interfaces;

public interface ISyncLogRepository
{
    Task<SyncLog?> GetByIdAsync(int id);
    Task<IEnumerable<SyncLog>> GetAllAsync();
    Task AddAsync(SyncLog log);
}
