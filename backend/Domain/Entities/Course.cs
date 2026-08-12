using System;
using System.Collections.Generic;
using Domain.Enums;

namespace Domain.Entities;

public class Course
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? InstructorId { get; set; }
    public User? Instructor { get; set; }
    public int? DepartmentId { get; set; }
    public Department? Department { get; set; }
    public CourseStatus Status { get; set; } = CourseStatus.Draft;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<CourseModule> Modules { get; set; } = new List<CourseModule>();
}
