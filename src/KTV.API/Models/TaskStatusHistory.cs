namespace KTV.API.Models;

public class TaskStatusHistory
{
    public int Id { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    public string? Comment { get; set; }
    
    // Navigation properties
    public int TaskId { get; set; }
    public Task? Task { get; set; }
    
    public int? FromStepId { get; set; }
    public WorkflowStep? FromStep { get; set; }
    
    public int? ToStepId { get; set; }
    public WorkflowStep? ToStep { get; set; }
    
    public int? ChangedByUserId { get; set; }
    public User? ChangedByUser { get; set; }
}
