namespace Application.DTOs;

public class UserQueryParameters
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int? DepartmentId { get; set; }
    public string? SearchTerm { get; set; }
}
