using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KTV.API.Data;
using KTV.API.DTOs;
using KTV.API.Models;

namespace KTV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkflowStepsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WorkflowStepsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkflowStepDto>>> GetWorkflowSteps()
    {
        var steps = await _context.WorkflowSteps.ToListAsync();
        return Ok(steps.Select(s => new WorkflowStepDto
        {
            Id = s.Id,
            Name = s.Name,
            Description = s.Description,
            Order = s.Order,
            WorkflowId = s.WorkflowId,
            CreatedAt = s.CreatedAt
        }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkflowStepDto>> GetWorkflowStep(int id)
    {
        var step = await _context.WorkflowSteps.FindAsync(id);
        if (step == null)
            return NotFound();

        return Ok(new WorkflowStepDto
        {
            Id = step.Id,
            Name = step.Name,
            Description = step.Description,
            Order = step.Order,
            WorkflowId = step.WorkflowId,
            CreatedAt = step.CreatedAt
        });
    }

    [HttpPost]
    public async Task<ActionResult<WorkflowStepDto>> CreateWorkflowStep(CreateWorkflowStepDto dto)
    {
        var step = new WorkflowStep
        {
            Name = dto.Name,
            Description = dto.Description,
            Order = dto.Order,
            WorkflowId = dto.WorkflowId,
            CreatedAt = DateTime.UtcNow
        };

        _context.WorkflowSteps.Add(step);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetWorkflowStep), new { id = step.Id }, new WorkflowStepDto
        {
            Id = step.Id,
            Name = step.Name,
            Description = step.Description,
            Order = step.Order,
            WorkflowId = step.WorkflowId,
            CreatedAt = step.CreatedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkflowStep(int id, UpdateWorkflowStepDto dto)
    {
        var step = await _context.WorkflowSteps.FindAsync(id);
        if (step == null)
            return NotFound();

        if (dto.Name != null)
            step.Name = dto.Name;
        if (dto.Description != null)
            step.Description = dto.Description;
        if (dto.Order.HasValue)
            step.Order = dto.Order.Value;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkflowStep(int id)
    {
        var step = await _context.WorkflowSteps.FindAsync(id);
        if (step == null)
            return NotFound();

        _context.WorkflowSteps.Remove(step);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
