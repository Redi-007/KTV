namespace KTV.API.DTOs;

public class TaskStatusHistoryDto
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public int? FromStepId { get; set; }
    public string? FromStepName { get; set; }
    public int? ToStepId { get; set; }
    public string? ToStepName { get; set; }
    public int? ChangedByUserId { get; set; }
    public string? ChangedByUserName { get; set; }
    public string? Comment { get; set; }
    public DateTime ChangedAt { get; set; }
}
