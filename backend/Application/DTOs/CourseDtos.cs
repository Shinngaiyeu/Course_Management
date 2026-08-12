using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Application.DTOs;

public class CourseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? InstructorId { get; set; }
    public string? InstructorName { get; set; }
    public CourseStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<CourseModuleDto> Modules { get; set; } = new();
}

public class CreateCourseDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? InstructorId { get; set; }
    public CourseStatus Status { get; set; }
}

public class UpdateCourseDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid? InstructorId { get; set; }
    public CourseStatus Status { get; set; }
}

public class CourseModuleDto
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }

    public List<LessonDto> Lessons { get; set; } = new();
}

public class CreateCourseModuleDto
{
    public int CourseId { get; set; }
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }
}

public class UpdateCourseModuleDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }
}

public class LessonDto
{
    public int Id { get; set; }
    public int CourseModuleId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? VideoUrl { get; set; }
    public string? Metadata { get; set; }
    public int OrderIndex { get; set; }
}

public class CreateLessonDto
{
    public int CourseModuleId { get; set; }
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? VideoUrl { get; set; }
    public string? Metadata { get; set; }
    public int OrderIndex { get; set; }
}

public class UpdateLessonDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? VideoUrl { get; set; }
    public string? Metadata { get; set; }
    public int OrderIndex { get; set; }
}
