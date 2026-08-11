using Application.DTOs;

namespace Application.Interfaces;

public interface ISyncLogService
{
    Task<IEnumerable<SyncLogDto>> GetAllLogsAsync();
    Task<SyncLogDto?> GetLogByIdAsync(int id);
}
