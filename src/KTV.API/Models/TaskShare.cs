namespace KTV.API.Models;

public class TaskShare
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public Task Task { get; set; } = null!;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime SharedAt { get; set; } = DateTime.UtcNow;
}
