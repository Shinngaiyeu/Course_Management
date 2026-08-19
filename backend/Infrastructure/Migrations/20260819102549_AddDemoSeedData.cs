using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDemoSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "DepartmentId", "Email", "IsActive", "PasswordHash", "UpdatedAt", "Username" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "admin@company.com", true, "password123", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 2, "hrmanager@company.com", true, "password123", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "hrmanager" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "itlearner@company.com", true, "password123", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "itlearner" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 4, "saleslearner@company.com", true, "password123", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "saleslearner" },
                    { new Guid("55555555-5555-5555-5555-555555555555"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 3, "financemanager@company.com", true, "password123", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "financemanager" }
                });

            migrationBuilder.InsertData(
                table: "Courses",
                columns: new[] { "Id", "CreatedAt", "DepartmentId", "Description", "InstructorId", "Status", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 101, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 1, "Learn the fundamentals of IT security in the workplace.", new Guid("11111111-1111-1111-1111-111111111111"), 1, "Information Security Basics", null },
                    { 102, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 4, "Everything you need to know to start selling effectively.", new Guid("22222222-2222-2222-2222-222222222222"), 1, "Sales Onboarding 101", null },
                    { 103, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 3, "Required training for handling financial records.", new Guid("55555555-5555-5555-5555-555555555555"), 0, "Financial Compliance", null }
                });

            migrationBuilder.InsertData(
                table: "UserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { 1, new Guid("11111111-1111-1111-1111-111111111111") },
                    { 2, new Guid("22222222-2222-2222-2222-222222222222") },
                    { 3, new Guid("33333333-3333-3333-3333-333333333333") },
                    { 3, new Guid("44444444-4444-4444-4444-444444444444") },
                    { 2, new Guid("55555555-5555-5555-5555-555555555555") }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Courses",
                keyColumn: "Id",
                keyValue: 101);

            migrationBuilder.DeleteData(
                table: "Courses",
                keyColumn: "Id",
                keyValue: 102);

            migrationBuilder.DeleteData(
                table: "Courses",
                keyColumn: "Id",
                keyValue: 103);

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 1, new Guid("11111111-1111-1111-1111-111111111111") });

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 2, new Guid("22222222-2222-2222-2222-222222222222") });

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 3, new Guid("33333333-3333-3333-3333-333333333333") });

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 3, new Guid("44444444-4444-4444-4444-444444444444") });

            migrationBuilder.DeleteData(
                table: "UserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { 2, new Guid("55555555-5555-5555-5555-555555555555") });

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"));
        }
    }
}
