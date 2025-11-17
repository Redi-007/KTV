namespace KTV.API.Models;

public class Task
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public int Priority { get; set; } = 0;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public int WorkflowId { get; set; }
    public Workflow? Workflow { get; set; }
    
    public int? CurrentStepId { get; set; }
    public WorkflowStep? CurrentStep { get; set; }
    
    public int? AssignedToUserId { get; set; }
    public User? AssignedToUser { get; set; }
    
    public ICollection<TaskStatusHistory> StatusHistory { get; set; } = new List<TaskStatusHistory>();
    public ICollection<Label> Labels { get; set; } = new List<Label>();
}
