using Application.DTOs;

namespace Application.Interfaces;

public interface ISyncLogService
{
    Task<PagedResult<SyncLogDto>> GetPagedLogsAsync(int pageNumber, int pageSize, string? status = null);
    Task<SyncLogDto?> GetLogByIdAsync(int id);
    Task<bool> RetrySyncLogAsync(int id);
}
