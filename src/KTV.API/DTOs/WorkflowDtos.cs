namespace KTV.API.DTOs;

public class WorkflowDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int InstitutionId { get; set; }
    public string? InstitutionName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public List<WorkflowStepDto> Steps { get; set; } = new();
}

public class CreateWorkflowDto
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public int InstitutionId { get; set; }
}

public class UpdateWorkflowDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public int? InstitutionId { get; set; }
}
