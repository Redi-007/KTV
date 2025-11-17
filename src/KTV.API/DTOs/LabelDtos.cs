namespace KTV.API.DTOs;

public class LabelDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Color { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateLabelDto
{
    public required string Name { get; set; }
    public string? Color { get; set; }
}

public class UpdateLabelDto
{
    public string? Name { get; set; }
    public string? Color { get; set; }
}
