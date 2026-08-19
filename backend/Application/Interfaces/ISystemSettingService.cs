namespace Application.Interfaces;

public interface ISystemSettingService
{
    Task<string> GetWebhookPathAsync();
    Task<bool> UpdateWebhookPathAsync(string newPath);
}
