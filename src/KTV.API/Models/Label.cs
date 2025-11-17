namespace KTV.API.Models;

public class Label
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Color { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<Task> Tasks { get; set; } = new List<Task>();
}
