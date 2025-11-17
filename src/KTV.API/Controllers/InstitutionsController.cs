using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KTV.API.Data;
using KTV.API.DTOs;
using KTV.API.Models;

namespace KTV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InstitutionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public InstitutionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InstitutionDto>>> GetInstitutions()
    {
        var institutions = await _context.Institutions.ToListAsync();
        return Ok(institutions.Select(i => new InstitutionDto
        {
            Id = i.Id,
            Name = i.Name,
            Description = i.Description,
            Address = i.Address,
            CreatedAt = i.CreatedAt,
            UpdatedAt = i.UpdatedAt
        }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InstitutionDto>> GetInstitution(int id)
    {
        var institution = await _context.Institutions.FindAsync(id);
        if (institution == null)
            return NotFound();

        return Ok(new InstitutionDto
        {
            Id = institution.Id,
            Name = institution.Name,
            Description = institution.Description,
            Address = institution.Address,
            CreatedAt = institution.CreatedAt,
            UpdatedAt = institution.UpdatedAt
        });
    }

    [HttpPost]
    public async Task<ActionResult<InstitutionDto>> CreateInstitution(CreateInstitutionDto dto)
    {
        var institution = new Institution
        {
            Name = dto.Name,
            Description = dto.Description,
            Address = dto.Address,
            CreatedAt = DateTime.UtcNow
        };

        _context.Institutions.Add(institution);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetInstitution), new { id = institution.Id }, new InstitutionDto
        {
            Id = institution.Id,
            Name = institution.Name,
            Description = institution.Description,
            Address = institution.Address,
            CreatedAt = institution.CreatedAt,
            UpdatedAt = institution.UpdatedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInstitution(int id, UpdateInstitutionDto dto)
    {
        var institution = await _context.Institutions.FindAsync(id);
        if (institution == null)
            return NotFound();

        if (dto.Name != null)
            institution.Name = dto.Name;
        if (dto.Description != null)
            institution.Description = dto.Description;
        if (dto.Address != null)
            institution.Address = dto.Address;

        institution.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInstitution(int id)
    {
        var institution = await _context.Institutions.FindAsync(id);
        if (institution == null)
            return NotFound();

        _context.Institutions.Remove(institution);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
