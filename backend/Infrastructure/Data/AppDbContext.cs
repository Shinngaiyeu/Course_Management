using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Department> Departments { get; set; } = null!;
    public DbSet<UserRole> UserRoles { get; set; } = null!;
    public DbSet<SyncLog> SyncLogs { get; set; } = null!;
    public DbSet<Course> Courses { get; set; } = null!;
    public DbSet<CourseModule> CourseModules { get; set; } = null!;
    public DbSet<Lesson> Lessons { get; set; } = null!;
    public DbSet<SystemSetting> SystemSettings { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<SystemSetting>()
            .HasKey(s => s.Key);

        modelBuilder.Entity<SystemSetting>().HasData(
            new SystemSetting { Key = "WebhookPath", Value = "hris-webhook" }
        );

        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId);

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "Manager" },
            new Role { Id = 3, Name = "Learner" }
        );

        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "IT Department", Description = "Information Technology and Infrastructure" },
            new Department { Id = 2, Name = "HR Department", Description = "Human Resources and Employee Relations" },
            new Department { Id = 3, Name = "Finance Department", Description = "Accounting and Financial Planning" },
            new Department { Id = 4, Name = "Sales Department", Description = "Sales and Customer Acquisition" }
        );

        modelBuilder.Entity<Course>()
            .HasOne(c => c.Instructor)
            .WithMany()
            .HasForeignKey(c => c.InstructorId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<CourseModule>()
            .HasOne(cm => cm.Course)
            .WithMany(c => c.Modules)
            .HasForeignKey(cm => cm.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Lesson>()
            .HasOne(l => l.CourseModule)
            .WithMany(cm => cm.Lessons)
            .HasForeignKey(l => l.CourseModuleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
