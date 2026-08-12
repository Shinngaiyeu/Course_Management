using Application.DTOs;
using Application.Interfaces;
using Domain.Interfaces;

using System.Text.Json;

namespace Application.Services;

public class SyncLogService : ISyncLogService
{
    private readonly ISyncLogRepository _repository;
    private readonly ISyncService _syncService;

    public SyncLogService(ISyncLogRepository repository, ISyncService syncService)
    {
        _repository = repository;
        _syncService = syncService;
    }

    public async Task<PagedResult<SyncLogDto>> GetPagedLogsAsync(int pageNumber, int pageSize, string? status = null)
    {
        var (items, totalCount) = await _repository.GetPagedAsync(pageNumber, pageSize, status);
        
        var dtos = items.Select(l => new SyncLogDto
        {
            Id = l.Id,
            SyncDate = l.SyncDate,
            Status = l.Status,
            Payload = l.Payload,
            Message = l.Message
        }).ToList();

        return new PagedResult<SyncLogDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<bool> RetrySyncLogAsync(int id)
    {
        var log = await _repository.GetByIdAsync(id);
        if (log == null || string.IsNullOrEmpty(log.Payload))
        {
            return false;
        }

        try
        {
            var payload = JsonSerializer.Deserialize<SyncPayload>(log.Payload);
            if (payload == null) return false;

            return await _syncService.SyncUserAsync(payload);
        }
        catch
        {
            return false;
        }
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
