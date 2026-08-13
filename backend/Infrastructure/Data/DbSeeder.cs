using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await context.Database.MigrateAsync();

        if (!await context.Users.AnyAsync())
        {
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Username = "Admin",
                Email = "admin@gmail.com",
                PasswordHash = "Admin@123",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await context.Users.AddAsync(adminUser);

            var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
            if (adminRole == null)
            {
                adminRole = new Role { Name = "Admin" };
                await context.Roles.AddAsync(adminRole);
                await context.SaveChangesAsync();
            }

            await context.UserRoles.AddAsync(new UserRole
            {
                UserId = adminUser.Id,
                RoleId = adminRole.Id
            });

            await context.SaveChangesAsync();
        }
    }
}
