namespace Application.DTOs;

public class SyncLogDto
{
    public int Id { get; set; }
    public DateTime SyncDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Payload { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
