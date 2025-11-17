using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KTV.API.Data;
using KTV.API.DTOs;
using KTV.API.Models;

namespace KTV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkflowsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WorkflowsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkflowDto>>> GetWorkflows()
    {
        var workflows = await _context.Workflows
            .Include(w => w.Institution)
            .Include(w => w.Steps)
            .ToListAsync();

        return Ok(workflows.Select(w => new WorkflowDto
        {
            Id = w.Id,
            Name = w.Name,
            Description = w.Description,
            InstitutionId = w.InstitutionId,
            InstitutionName = w.Institution?.Name,
            CreatedAt = w.CreatedAt,
            UpdatedAt = w.UpdatedAt,
            Steps = w.Steps.Select(s => new WorkflowStepDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                Order = s.Order,
                WorkflowId = s.WorkflowId,
                CreatedAt = s.CreatedAt
            }).OrderBy(s => s.Order).ToList()
        }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkflowDto>> GetWorkflow(int id)
    {
        var workflow = await _context.Workflows
            .Include(w => w.Institution)
            .Include(w => w.Steps)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (workflow == null)
            return NotFound();

        return Ok(new WorkflowDto
        {
            Id = workflow.Id,
            Name = workflow.Name,
            Description = workflow.Description,
            InstitutionId = workflow.InstitutionId,
            InstitutionName = workflow.Institution?.Name,
            CreatedAt = workflow.CreatedAt,
            UpdatedAt = workflow.UpdatedAt,
            Steps = workflow.Steps.Select(s => new WorkflowStepDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                Order = s.Order,
                WorkflowId = s.WorkflowId,
                CreatedAt = s.CreatedAt
            }).OrderBy(s => s.Order).ToList()
        });
    }

    [HttpPost]
    public async Task<ActionResult<WorkflowDto>> CreateWorkflow(CreateWorkflowDto dto)
    {
        var workflow = new Workflow
        {
            Name = dto.Name,
            Description = dto.Description,
            InstitutionId = dto.InstitutionId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Workflows.Add(workflow);
        await _context.SaveChangesAsync();

        await _context.Entry(workflow).Reference(w => w.Institution).LoadAsync();

        return CreatedAtAction(nameof(GetWorkflow), new { id = workflow.Id }, new WorkflowDto
        {
            Id = workflow.Id,
            Name = workflow.Name,
            Description = workflow.Description,
            InstitutionId = workflow.InstitutionId,
            InstitutionName = workflow.Institution?.Name,
            CreatedAt = workflow.CreatedAt,
            UpdatedAt = workflow.UpdatedAt,
            Steps = new List<WorkflowStepDto>()
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkflow(int id, UpdateWorkflowDto dto)
    {
        var workflow = await _context.Workflows.FindAsync(id);
        if (workflow == null)
            return NotFound();

        if (dto.Name != null)
            workflow.Name = dto.Name;
        if (dto.Description != null)
            workflow.Description = dto.Description;
        if (dto.InstitutionId.HasValue)
            workflow.InstitutionId = dto.InstitutionId.Value;

        workflow.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkflow(int id)
    {
        var workflow = await _context.Workflows.FindAsync(id);
        if (workflow == null)
            return NotFound();

        _context.Workflows.Remove(workflow);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
