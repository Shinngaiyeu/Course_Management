namespace Domain.Entities;

public class Lesson
{
    public int Id { get; set; }
    public int CourseModuleId { get; set; }
    public CourseModule? CourseModule { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? VideoUrl { get; set; }
    public string? Metadata { get; set; }
    public int OrderIndex { get; set; }
}
