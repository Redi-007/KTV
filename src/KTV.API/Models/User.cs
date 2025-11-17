namespace KTV.API.Models;

public class User
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public int? InstitutionId { get; set; }
    public Institution? Institution { get; set; }
    public ICollection<Role> Roles { get; set; } = new List<Role>();
    public ICollection<Task> AssignedTasks { get; set; } = new List<Task>();
}
