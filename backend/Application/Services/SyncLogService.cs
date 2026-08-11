using Application.DTOs;
using Application.Interfaces;
using Domain.Interfaces;

namespace Application.Services;

public class SyncLogService : ISyncLogService
{
    private readonly ISyncLogRepository _repository;

    public SyncLogService(ISyncLogRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<SyncLogDto>> GetAllLogsAsync()
    {
        var logs = await _repository.GetAllAsync();
        return logs.Select(l => new SyncLogDto
        {
            Id = l.Id,
            SyncDate = l.SyncDate,
            Status = l.Status,
            Payload = l.Payload,
            Message = l.Message
        });
    }

    public async Task<SyncLogDto?> GetLogByIdAsync(int id)
    {
        var l = await _repository.GetByIdAsync(id);
        if (l == null) return null;

        return new SyncLogDto
        {
            Id = l.Id,
            SyncDate = l.SyncDate,
            Status = l.Status,
            Payload = l.Payload,
            Message = l.Message
        };
    }
}
