using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CourseRepository : ICourseRepository
{
    private readonly AppDbContext _context;

    public CourseRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<Course> Items, int TotalCount)> GetPagedCoursesAsync(int pageNumber, int pageSize, string? searchTerm = null, int? departmentId = null, bool onlyPublished = false)
    {
        var query = _context.Courses
            .Include(c => c.Instructor)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(c => c.Title.Contains(searchTerm) || (c.Description != null && c.Description.Contains(searchTerm)));
        }

        if (departmentId.HasValue)
        {
            query = query.Where(c => c.DepartmentId == departmentId.Value);
        }

        if (onlyPublished)
        {
            query = query.Where(c => c.Status == Domain.Enums.CourseStatus.Published);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Course?> GetCourseByIdAsync(int id)
    {
        return await _context.Courses
            .Include(c => c.Instructor)
            .Include(c => c.Modules.OrderBy(m => m.OrderIndex))
                .ThenInclude(m => m.Lessons.OrderBy(l => l.OrderIndex))
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Course> CreateCourseAsync(Course course)
    {
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        return course;
    }

    public async Task UpdateCourseAsync(Course course)
    {
        _context.Courses.Update(course);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCourseAsync(Course course)
    {
        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
    }

    public async Task<CourseModule?> GetModuleByIdAsync(int id)
    {
        return await _context.CourseModules
            .Include(m => m.Lessons.OrderBy(l => l.OrderIndex))
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<CourseModule> CreateModuleAsync(CourseModule module)
    {
        _context.CourseModules.Add(module);
        await _context.SaveChangesAsync();
        return module;
    }

    public async Task UpdateModuleAsync(CourseModule module)
    {
        _context.CourseModules.Update(module);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteModuleAsync(CourseModule module)
    {
        _context.CourseModules.Remove(module);
        await _context.SaveChangesAsync();
    }

    public async Task<Lesson?> GetLessonByIdAsync(int id)
    {
        return await _context.Lessons.FindAsync(id);
    }

    public async Task<Lesson> CreateLessonAsync(Lesson lesson)
    {
        _context.Lessons.Add(lesson);
        await _context.SaveChangesAsync();
        return lesson;
    }

    public async Task UpdateLessonAsync(Lesson lesson)
    {
        _context.Lessons.Update(lesson);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteLessonAsync(Lesson lesson)
    {
        _context.Lessons.Remove(lesson);
        await _context.SaveChangesAsync();
    }
}
