namespace KTV.API.DTOs;

public class WorkflowStepDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int Order { get; set; }
    public int WorkflowId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateWorkflowStepDto
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int Order { get; set; }
    public int WorkflowId { get; set; }
}

public class UpdateWorkflowStepDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int? Order { get; set; }
}
