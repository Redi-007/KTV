using KTV.API.Data;
using KTV.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace KTV.API;

public static class DbSeeder
{
    public static async System.Threading.Tasks.Task SeedAsync(ApplicationDbContext context)
    {
        // Check if database is already seeded
        if (await context.Institutions.AnyAsync())
        {
            return; // Database already seeded
        }

        // Create Roles
        var adminRole = new Role { Name = "Admin", Description = "Administrator role", CreatedAt = DateTime.UtcNow };
        var userRole = new Role { Name = "User", Description = "Regular user role", CreatedAt = DateTime.UtcNow };
        context.Roles.AddRange(adminRole, userRole);
        await context.SaveChangesAsync();

        // Create Institution
        var institution = new Institution
        {
            Name = "Demo Organization",
            Description = "Sample organization for testing",
            Address = "123 Main Street",
            CreatedAt = DateTime.UtcNow
        };
        context.Institutions.Add(institution);
        await context.SaveChangesAsync();

        // Create Users
        var user1 = new User
        {
            Username = "john_doe",
            Email = "john@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            FirstName = "John",
            LastName = "Doe",
            InstitutionId = institution.Id,
            CreatedAt = DateTime.UtcNow
        };
        user1.Roles.Add(adminRole);

        var user2 = new User
        {
            Username = "jane_smith",
            Email = "jane@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            FirstName = "Jane",
            LastName = "Smith",
            InstitutionId = institution.Id,
            CreatedAt = DateTime.UtcNow
        };
        user2.Roles.Add(userRole);

        context.Users.AddRange(user1, user2);
        await context.SaveChangesAsync();

        // Create Workflow
        var workflow = new Workflow
        {
            Name = "Software Development",
            Description = "Software development workflow",
            InstitutionId = institution.Id,
            CreatedAt = DateTime.UtcNow
        };
        context.Workflows.Add(workflow);
        await context.SaveChangesAsync();

        // Create Workflow Steps
        var todoStep = new WorkflowStep
        {
            Name = "To Do",
            Description = "Tasks to be started",
            Order = 1,
            WorkflowId = workflow.Id,
            CreatedAt = DateTime.UtcNow
        };

        var inProgressStep = new WorkflowStep
        {
            Name = "In Progress",
            Description = "Tasks currently being worked on",
            Order = 2,
            WorkflowId = workflow.Id,
            CreatedAt = DateTime.UtcNow
        };

        var reviewStep = new WorkflowStep
        {
            Name = "Review",
            Description = "Tasks in review",
            Order = 3,
            WorkflowId = workflow.Id,
            CreatedAt = DateTime.UtcNow
        };

        var doneStep = new WorkflowStep
        {
            Name = "Done",
            Description = "Completed tasks",
            Order = 4,
            WorkflowId = workflow.Id,
            CreatedAt = DateTime.UtcNow
        };

        context.WorkflowSteps.AddRange(todoStep, inProgressStep, reviewStep, doneStep);
        await context.SaveChangesAsync();

        // Create Labels
        var bugLabel = new Label { Name = "Bug", Color = "#ff0000", CreatedAt = DateTime.UtcNow };
        var featureLabel = new Label { Name = "Feature", Color = "#00ff00", CreatedAt = DateTime.UtcNow };
        var urgentLabel = new Label { Name = "Urgent", Color = "#ff9900", CreatedAt = DateTime.UtcNow };
        context.Labels.AddRange(bugLabel, featureLabel, urgentLabel);
        await context.SaveChangesAsync();

        // Create Sample Tasks
        var task1 = new Models.Task
        {
            Title = "Implement user authentication",
            Description = "Add JWT-based authentication to the API",
            Priority = 1,
            WorkflowId = workflow.Id,
            CurrentStepId = todoStep.Id,
            AssignedToUserId = user1.Id,
            CreatedAt = DateTime.UtcNow
        };
        task1.Labels.Add(featureLabel);

        var task2 = new Models.Task
        {
            Title = "Fix login page bug",
            Description = "Login button not working on mobile devices",
            Priority = 2,
            WorkflowId = workflow.Id,
            CurrentStepId = inProgressStep.Id,
            AssignedToUserId = user2.Id,
            CreatedAt = DateTime.UtcNow
        };
        task2.Labels.Add(bugLabel);
        task2.Labels.Add(urgentLabel);

        var task3 = new Models.Task
        {
            Title = "Design new dashboard",
            Description = "Create mockups for the new dashboard layout",
            Priority = 0,
            WorkflowId = workflow.Id,
            CurrentStepId = reviewStep.Id,
            AssignedToUserId = user1.Id,
            CreatedAt = DateTime.UtcNow
        };
        task3.Labels.Add(featureLabel);

        var task4 = new Models.Task
        {
            Title = "Update documentation",
            Description = "Update API documentation with new endpoints",
            Priority = 0,
            WorkflowId = workflow.Id,
            CurrentStepId = doneStep.Id,
            AssignedToUserId = user2.Id,
            CreatedAt = DateTime.UtcNow
        };

        context.Tasks.AddRange(task1, task2, task3, task4);
        await context.SaveChangesAsync();

        Console.WriteLine("Database seeded successfully!");
    }
}
