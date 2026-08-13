namespace Domain.Entities;

public class SyncLog
{
    public int Id { get; set; }
    public DateTime SyncDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = string.Empty;
    public string Payload { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
