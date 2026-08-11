using Application.DTOs;

namespace Application.Interfaces;

public interface ISyncService
{
    Task<bool> SyncUserAsync(SyncPayload payload);
}
