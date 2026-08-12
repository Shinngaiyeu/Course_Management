using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces;

public interface ICourseService
{
    Task<PagedResult<CourseDto>> GetPagedCoursesAsync(int pageNumber, int pageSize, string? searchTerm = null, int? departmentId = null, bool onlyPublished = false);
    Task<CourseDto?> GetCourseByIdAsync(int id);
    Task<CourseDto> CreateCourseAsync(CreateCourseDto dto, int? departmentId);
    Task<CourseDto> UpdateCourseAsync(int id, UpdateCourseDto dto);
    Task DeleteCourseAsync(int id);

    Task<CourseModuleDto> CreateModuleAsync(CreateCourseModuleDto dto);
    Task<CourseModuleDto> UpdateModuleAsync(int id, UpdateCourseModuleDto dto);
    Task DeleteModuleAsync(int id);

    Task<LessonDto> CreateLessonAsync(CreateLessonDto dto);
    Task<LessonDto> UpdateLessonAsync(int id, UpdateLessonDto dto);
    Task DeleteLessonAsync(int id);
}
