namespace KTV.API.Models;

public class WorkflowStep
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int Order { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public int WorkflowId { get; set; }
    public Workflow? Workflow { get; set; }
    public ICollection<Task> Tasks { get; set; } = new List<Task>();
}
