namespace KTV.API.Models;

public class Workflow
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public int InstitutionId { get; set; }
    public Institution? Institution { get; set; }
    public ICollection<WorkflowStep> Steps { get; set; } = new List<WorkflowStep>();
    public ICollection<Task> Tasks { get; set; } = new List<Task>();
}
