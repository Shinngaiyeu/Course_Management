using System;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepository;

    public CourseService(ICourseRepository courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task<PagedResult<CourseDto>> GetPagedCoursesAsync(int pageNumber, int pageSize, string? searchTerm = null, int? departmentId = null, bool onlyPublished = false)
    {
        var result = await _courseRepository.GetPagedCoursesAsync(pageNumber, pageSize, searchTerm, departmentId, onlyPublished);
        var courses = result.Items;
        var totalCount = result.TotalCount;
        
        var pagedCourses = courses
            .Select(c => new CourseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                InstructorId = c.InstructorId,
                InstructorName = c.Instructor?.Username,
                Status = c.Status,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .ToList();

        return new PagedResult<CourseDto> 
        { 
            Items = pagedCourses, 
            TotalCount = totalCount, 
            PageNumber = pageNumber, 
            PageSize = pageSize 
        };
    }

    public async Task<CourseDto?> GetCourseByIdAsync(int id)
    {
        var course = await _courseRepository.GetCourseByIdAsync(id);
        if (course == null) return null;

        return new CourseDto
        {
            Id = course.Id,
            Title = course.Title,
            Description = course.Description,
            InstructorId = course.InstructorId,
            InstructorName = course.Instructor?.Username,
            Status = course.Status,
            CreatedAt = course.CreatedAt,
            UpdatedAt = course.UpdatedAt,
            Modules = course.Modules.Select(m => new CourseModuleDto
            {
                Id = m.Id,
                CourseId = m.CourseId,
                Title = m.Title,
                Description = m.Description,
                OrderIndex = m.OrderIndex,
                Lessons = m.Lessons.Select(l => new LessonDto
                {
                    Id = l.Id,
                    CourseModuleId = l.CourseModuleId,
                    Title = l.Title,
                    Content = l.Content,
                    VideoUrl = l.VideoUrl,
                    Metadata = l.Metadata,
                    OrderIndex = l.OrderIndex
                }).ToList()
            }).ToList()
        };
    }

    public async Task<CourseDto> CreateCourseAsync(CreateCourseDto dto, int? departmentId)
    {
        var course = new Course
        {
            Title = dto.Title,
            Description = dto.Description,
            InstructorId = dto.InstructorId,
            DepartmentId = departmentId,
            Status = dto.Status,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _courseRepository.CreateCourseAsync(course);
        return await GetCourseByIdAsync(created.Id) ?? throw new Exception("Failed to create course");
    }

    public async Task<CourseDto> UpdateCourseAsync(int id, UpdateCourseDto dto)
    {
        var course = await _courseRepository.GetCourseByIdAsync(id) ?? throw new Exception("Course not found");

        course.Title = dto.Title;
        course.Description = dto.Description;
        course.InstructorId = dto.InstructorId;
        course.Status = dto.Status;
        course.UpdatedAt = DateTime.UtcNow;

        await _courseRepository.UpdateCourseAsync(course);
        return await GetCourseByIdAsync(course.Id) ?? throw new Exception("Failed to update course");
    }

    public async Task DeleteCourseAsync(int id)
    {
        var course = await _courseRepository.GetCourseByIdAsync(id) ?? throw new Exception("Course not found");
        await _courseRepository.DeleteCourseAsync(course);
    }

    public async Task<CourseModuleDto> CreateModuleAsync(CreateCourseModuleDto dto)
    {
        var module = new CourseModule
        {
            CourseId = dto.CourseId,
            Title = dto.Title,
            Description = dto.Description,
            OrderIndex = dto.OrderIndex
        };

        var created = await _courseRepository.CreateModuleAsync(module);
        return new CourseModuleDto
        {
            Id = created.Id,
            CourseId = created.CourseId,
            Title = created.Title,
            Description = created.Description,
            OrderIndex = created.OrderIndex
        };
    }

    public async Task<CourseModuleDto> UpdateModuleAsync(int id, UpdateCourseModuleDto dto)
    {
        var module = await _courseRepository.GetModuleByIdAsync(id) ?? throw new Exception("Module not found");

        module.Title = dto.Title;
        module.Description = dto.Description;
        module.OrderIndex = dto.OrderIndex;

        await _courseRepository.UpdateModuleAsync(module);
        return new CourseModuleDto
        {
            Id = module.Id,
            CourseId = module.CourseId,
            Title = module.Title,
            Description = module.Description,
            OrderIndex = module.OrderIndex
        };
    }

    public async Task DeleteModuleAsync(int id)
    {
        var module = await _courseRepository.GetModuleByIdAsync(id) ?? throw new Exception("Module not found");
        await _courseRepository.DeleteModuleAsync(module);
    }

    public async Task<LessonDto> CreateLessonAsync(CreateLessonDto dto)
    {
        var lesson = new Lesson
        {
            CourseModuleId = dto.CourseModuleId,
            Title = dto.Title,
            Content = dto.Content,
            VideoUrl = dto.VideoUrl,
            Metadata = dto.Metadata,
            OrderIndex = dto.OrderIndex
        };

        var created = await _courseRepository.CreateLessonAsync(lesson);
        return new LessonDto
        {
            Id = created.Id,
            CourseModuleId = created.CourseModuleId,
            Title = created.Title,
            Content = created.Content,
            VideoUrl = created.VideoUrl,
            Metadata = created.Metadata,
            OrderIndex = created.OrderIndex
        };
    }

    public async Task<LessonDto> UpdateLessonAsync(int id, UpdateLessonDto dto)
    {
        var lesson = await _courseRepository.GetLessonByIdAsync(id) ?? throw new Exception("Lesson not found");

        lesson.Title = dto.Title;
        lesson.Content = dto.Content;
        lesson.VideoUrl = dto.VideoUrl;
        lesson.Metadata = dto.Metadata;
        lesson.OrderIndex = dto.OrderIndex;

        await _courseRepository.UpdateLessonAsync(lesson);
        return new LessonDto
        {
            Id = lesson.Id,
            CourseModuleId = lesson.CourseModuleId,
            Title = lesson.Title,
            Content = lesson.Content,
            VideoUrl = lesson.VideoUrl,
            Metadata = lesson.Metadata,
            OrderIndex = lesson.OrderIndex
        };
    }

    public async Task DeleteLessonAsync(int id)
    {
        var lesson = await _courseRepository.GetLessonByIdAsync(id) ?? throw new Exception("Lesson not found");
        await _courseRepository.DeleteLessonAsync(lesson);
    }
}
