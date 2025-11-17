using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KTV.API.Data;
using KTV.API.DTOs;
using KTV.API.Models;

namespace KTV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LabelsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LabelsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LabelDto>>> GetLabels()
    {
        var labels = await _context.Labels.ToListAsync();
        return Ok(labels.Select(l => new LabelDto
        {
            Id = l.Id,
            Name = l.Name,
            Color = l.Color,
            CreatedAt = l.CreatedAt
        }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<LabelDto>> GetLabel(int id)
    {
        var label = await _context.Labels.FindAsync(id);
        if (label == null)
            return NotFound();

        return Ok(new LabelDto
        {
            Id = label.Id,
            Name = label.Name,
            Color = label.Color,
            CreatedAt = label.CreatedAt
        });
    }

    [HttpPost]
    public async Task<ActionResult<LabelDto>> CreateLabel(CreateLabelDto dto)
    {
        var label = new Label
        {
            Name = dto.Name,
            Color = dto.Color,
            CreatedAt = DateTime.UtcNow
        };

        _context.Labels.Add(label);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetLabel), new { id = label.Id }, new LabelDto
        {
            Id = label.Id,
            Name = label.Name,
            Color = label.Color,
            CreatedAt = label.CreatedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLabel(int id, UpdateLabelDto dto)
    {
        var label = await _context.Labels.FindAsync(id);
        if (label == null)
            return NotFound();

        if (dto.Name != null)
            label.Name = dto.Name;
        if (dto.Color != null)
            label.Color = dto.Color;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLabel(int id)
    {
        var label = await _context.Labels.FindAsync(id);
        if (label == null)
            return NotFound();

        _context.Labels.Remove(label);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
