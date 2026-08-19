using Application.DTOs;

namespace Application.Interfaces;

public interface ISyncService
{
    Task<(bool Success, string Message)> SyncUserAsync(SyncPayload payload);
}
