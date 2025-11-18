namespace KTV.API.DTOs;

public class TaskDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public int Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public int WorkflowId { get; set; }
    public string? WorkflowName { get; set; }
    public int? CurrentStepId { get; set; }
    public string? CurrentStepName { get; set; }
    public int? AssignedToUserId { get; set; }
    public string? AssignedToUserName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<LabelDto> Labels { get; set; } = new();
}

public class CreateTaskDto
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public int Priority { get; set; } = 0;
    public DateTime? DueDate { get; set; }
    public int WorkflowId { get; set; }
    public int? CurrentStepId { get; set; }
    public int? AssignedToUserId { get; set; }
    public List<int> AssignedToUserIds { get; set; } = new();
    public List<int> LabelIds { get; set; } = new();
}

public class UpdateTaskDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int? Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public int? CurrentStepId { get; set; }
    public int? AssignedToUserId { get; set; }
    public List<int>? AssignedToUserIds { get; set; }
    public List<int>? LabelIds { get; set; }
}

public class MoveTaskDto
{
    public int ToStepId { get; set; }
    public string? Comment { get; set; }
    public int? ChangedByUserId { get; set; }
    public int? AssignToUserId { get; set; }
}

public class AssignTaskDto
{
    public int? AssignedToUserId { get; set; }
}
