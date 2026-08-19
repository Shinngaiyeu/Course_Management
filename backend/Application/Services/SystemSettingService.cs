using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services;

public class SystemSettingService : ISystemSettingService
{
    private readonly ISystemSettingRepository _repository;

    public SystemSettingService(ISystemSettingRepository repository)
    {
        _repository = repository;
    }

    public async Task<string> GetWebhookPathAsync()
    {
        var setting = await _repository.GetByKeyAsync("WebhookPath");
        return setting?.Value ?? "hris-webhook";
    }

    public async Task<bool> UpdateWebhookPathAsync(string newPath)
    {
        var setting = await _repository.GetByKeyAsync("WebhookPath");
        if (setting == null)
        {
            await _repository.AddAsync(new SystemSetting { Key = "WebhookPath", Value = newPath });
        }
        else
        {
            setting.Value = newPath;
            await _repository.UpdateAsync(setting);
        }
        return true;
    }
}
