using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Interfaces;

public interface ICourseRepository
{
    Task<(IEnumerable<Course> Items, int TotalCount)> GetPagedCoursesAsync(int pageNumber, int pageSize, string? searchTerm = null, int? departmentId = null, bool onlyPublished = false);
    Task<Course?> GetCourseByIdAsync(int id);
    Task<Course> CreateCourseAsync(Course course);
    Task UpdateCourseAsync(Course course);
    Task DeleteCourseAsync(Course course);

    Task<CourseModule?> GetModuleByIdAsync(int id);
    Task<CourseModule> CreateModuleAsync(CourseModule module);
    Task UpdateModuleAsync(CourseModule module);
    Task DeleteModuleAsync(CourseModule module);

    Task<Lesson?> GetLessonByIdAsync(int id);
    Task<Lesson> CreateLessonAsync(Lesson lesson);
    Task UpdateLessonAsync(Lesson lesson);
    Task DeleteLessonAsync(Lesson lesson);
}
