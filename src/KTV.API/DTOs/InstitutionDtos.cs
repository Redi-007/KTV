namespace KTV.API.DTOs;

public class InstitutionDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateInstitutionDto
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
}

public class UpdateInstitutionDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
}
