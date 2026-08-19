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

        // Seed Data for Demo
        var adminGuid = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var hrManagerGuid = Guid.Parse("22222222-2222-2222-2222-222222222222");
        var itLearnerGuid = Guid.Parse("33333333-3333-3333-3333-333333333333");
        var salesLearnerGuid = Guid.Parse("44444444-4444-4444-4444-444444444444");
        var financeManagerGuid = Guid.Parse("55555555-5555-5555-5555-555555555555");
        
        var baseDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<User>().HasData(
            new User { Id = adminGuid, Username = "admin", Email = "admin@company.com", PasswordHash = "password123", DepartmentId = 1, IsActive = true, CreatedAt = baseDate, UpdatedAt = baseDate },
            new User { Id = hrManagerGuid, Username = "hrmanager", Email = "hrmanager@company.com", PasswordHash = "password123", DepartmentId = 2, IsActive = true, CreatedAt = baseDate, UpdatedAt = baseDate },
            new User { Id = itLearnerGuid, Username = "itlearner", Email = "itlearner@company.com", PasswordHash = "password123", DepartmentId = 1, IsActive = true, CreatedAt = baseDate, UpdatedAt = baseDate },
            new User { Id = salesLearnerGuid, Username = "saleslearner", Email = "saleslearner@company.com", PasswordHash = "password123", DepartmentId = 4, IsActive = true, CreatedAt = baseDate, UpdatedAt = baseDate },
            new User { Id = financeManagerGuid, Username = "financemanager", Email = "financemanager@company.com", PasswordHash = "password123", DepartmentId = 3, IsActive = true, CreatedAt = baseDate, UpdatedAt = baseDate }
        );

        modelBuilder.Entity<UserRole>().HasData(
            new UserRole { UserId = adminGuid, RoleId = 1 }, // Admin
            new UserRole { UserId = hrManagerGuid, RoleId = 2 }, // Manager
            new UserRole { UserId = itLearnerGuid, RoleId = 3 }, // Learner
            new UserRole { UserId = salesLearnerGuid, RoleId = 3 }, // Learner
            new UserRole { UserId = financeManagerGuid, RoleId = 2 } // Manager
        );

        modelBuilder.Entity<Course>().HasData(
            new Course { Id = 101, Title = "Information Security Basics", Description = "Learn the fundamentals of IT security in the workplace.", DepartmentId = 1, InstructorId = adminGuid, Status = Domain.Enums.CourseStatus.Published, CreatedAt = baseDate },
            new Course { Id = 102, Title = "Sales Onboarding 101", Description = "Everything you need to know to start selling effectively.", DepartmentId = 4, InstructorId = hrManagerGuid, Status = Domain.Enums.CourseStatus.Published, CreatedAt = baseDate },
            new Course { Id = 103, Title = "Financial Compliance", Description = "Required training for handling financial records.", DepartmentId = 3, InstructorId = financeManagerGuid, Status = Domain.Enums.CourseStatus.Draft, CreatedAt = baseDate }
        );
    }
}
