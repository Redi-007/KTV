using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KTV.API.Data;
using KTV.API.DTOs;
using KTV.API.Models;

namespace KTV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TasksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
    {
        var tasks = await _context.Tasks
            .Include(t => t.Workflow)
            .Include(t => t.CurrentStep)
            .Include(t => t.AssignedToUser)
            .Include(t => t.Labels)
            .ToListAsync();

        return Ok(tasks.Select(t => new TaskDto
        {
            Id = t.Id,
            Title = t.Title,
            Description = t.Description,
            Priority = t.Priority,
            DueDate = t.DueDate,
            WorkflowId = t.WorkflowId,
            WorkflowName = t.Workflow?.Name,
            CurrentStepId = t.CurrentStepId,
            CurrentStepName = t.CurrentStep?.Name,
            AssignedToUserId = t.AssignedToUserId,
            AssignedToUserName = t.AssignedToUser?.Username,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.UpdatedAt,
            Labels = t.Labels.Select(l => new LabelDto
            {
                Id = l.Id,
                Name = l.Name,
                Color = l.Color,
                CreatedAt = l.CreatedAt
            }).ToList()
        }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(int id)
    {
        var task = await _context.Tasks
            .Include(t => t.Workflow)
            .Include(t => t.CurrentStep)
            .Include(t => t.AssignedToUser)
            .Include(t => t.Labels)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
            return NotFound();

        return Ok(new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            DueDate = task.DueDate,
            WorkflowId = task.WorkflowId,
            WorkflowName = task.Workflow?.Name,
            CurrentStepId = task.CurrentStepId,
            CurrentStepName = task.CurrentStep?.Name,
            AssignedToUserId = task.AssignedToUserId,
            AssignedToUserName = task.AssignedToUser?.Username,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            Labels = task.Labels.Select(l => new LabelDto
            {
                Id = l.Id,
                Name = l.Name,
                Color = l.Color,
                CreatedAt = l.CreatedAt
            }).ToList()
        });
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskDto dto)
    {
        var task = new Models.Task
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            WorkflowId = dto.WorkflowId,
            CurrentStepId = dto.CurrentStepId,
            AssignedToUserId = dto.AssignedToUserId ?? (dto.AssignedToUserIds != null && dto.AssignedToUserIds.Any() ? dto.AssignedToUserIds.First() : null),
            CreatedAt = DateTime.UtcNow
        };

        if (dto.LabelIds.Any())
        {
            var labels = await _context.Labels
                .Where(l => dto.LabelIds.Contains(l.Id))
                .ToListAsync();
            task.Labels = labels;
        }

        // Persist TaskShare entries for multiple assignees if provided
        var sharesToAdd = new List<TaskShare>();

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        if (dto.AssignedToUserIds != null && dto.AssignedToUserIds.Any())
        {
            var validUserIds = await _context.Users
                .Where(u => dto.AssignedToUserIds.Contains(u.Id))
                .Select(u => u.Id)
                .ToListAsync();

            foreach (var uid in validUserIds.Distinct())
            {
                // skip if same as AssignedToUserId (primary)
                if (task.AssignedToUserId.HasValue && task.AssignedToUserId.Value == uid) continue;
                sharesToAdd.Add(new TaskShare { TaskId = task.Id, UserId = uid });
            }

            if (sharesToAdd.Any())
            {
                _context.TaskShares.AddRange(sharesToAdd);
                await _context.SaveChangesAsync();
            }
        }

        await _context.Entry(task).Reference(t => t.Workflow).LoadAsync();
        await _context.Entry(task).Reference(t => t.CurrentStep).LoadAsync();
        await _context.Entry(task).Reference(t => t.AssignedToUser).LoadAsync();

        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            DueDate = task.DueDate,
            WorkflowId = task.WorkflowId,
            WorkflowName = task.Workflow?.Name,
            CurrentStepId = task.CurrentStepId,
            CurrentStepName = task.CurrentStep?.Name,
            AssignedToUserId = task.AssignedToUserId,
            AssignedToUserName = task.AssignedToUser?.Username,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            Labels = task.Labels.Select(l => new LabelDto
            {
                Id = l.Id,
                Name = l.Name,
                Color = l.Color,
                CreatedAt = l.CreatedAt
            }).ToList()
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, UpdateTaskDto dto)
    {
        var task = await _context.Tasks
            .Include(t => t.Labels)
            .Include(t => t.SharedWith)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
            return NotFound();

        if (dto.Title != null)
            task.Title = dto.Title;
        if (dto.Description != null)
            task.Description = dto.Description;
        if (dto.Priority.HasValue)
            task.Priority = dto.Priority.Value;
        if (dto.DueDate.HasValue)
            task.DueDate = dto.DueDate;
        if (dto.CurrentStepId.HasValue)
            task.CurrentStepId = dto.CurrentStepId;
        if (dto.AssignedToUserId.HasValue)
            task.AssignedToUserId = dto.AssignedToUserId;

        if (dto.LabelIds != null)
        {
            task.Labels.Clear();
            var labels = await _context.Labels
                .Where(l => dto.LabelIds.Contains(l.Id))
                .ToListAsync();
            task.Labels = labels;
        }

        // Update TaskShare entries when AssignedToUserIds provided
        if (dto.AssignedToUserIds != null)
        {
            // Remove existing shares
            var existingShares = _context.TaskShares.Where(s => s.TaskId == task.Id);
            _context.TaskShares.RemoveRange(existingShares);

            var validUserIds = await _context.Users
                .Where(u => dto.AssignedToUserIds.Contains(u.Id))
                .Select(u => u.Id)
                .ToListAsync();

            var newShares = validUserIds.Distinct()
                .Where(uid => !(task.AssignedToUserId.HasValue && task.AssignedToUserId.Value == uid))
                .Select(uid => new TaskShare { TaskId = task.Id, UserId = uid })
                .ToList();

            if (newShares.Any()) _context.TaskShares.AddRange(newShares);
        }

        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Specialized endpoint for moving tasks between workflow steps
    [HttpPost("{id}/move")]
    public async Task<ActionResult<TaskDto>> MoveTask(int id, MoveTaskDto dto)
    {
        var task = await _context.Tasks
            .Include(t => t.CurrentStep)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
            return NotFound();

        var toStep = await _context.WorkflowSteps.FindAsync(dto.ToStepId);
        if (toStep == null)
            return BadRequest("Target step not found");

        // Create status history entry
        var history = new TaskStatusHistory
        {
            TaskId = task.Id,
            FromStepId = task.CurrentStepId,
            ToStepId = dto.ToStepId,
            ChangedByUserId = dto.ChangedByUserId,
            Comment = dto.Comment,
            ChangedAt = DateTime.UtcNow
        };

        _context.TaskStatusHistories.Add(history);

        // Update task's current step
        task.CurrentStepId = dto.ToStepId;
        // Optionally assign to a different user when moving
        if (dto.AssignToUserId.HasValue)
        {
            task.AssignedToUserId = dto.AssignToUserId;
            // Also persist a TaskShare for the assigned user if needed
            var exists = await _context.Users.AnyAsync(u => u.Id == dto.AssignToUserId.Value);
            if (exists)
            {
                _context.TaskShares.Add(new TaskShare { TaskId = task.Id, UserId = dto.AssignToUserId.Value });
            }
        }
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Reload related data
        await _context.Entry(task).Reference(t => t.Workflow).LoadAsync();
        await _context.Entry(task).Reference(t => t.CurrentStep).LoadAsync();
        await _context.Entry(task).Reference(t => t.AssignedToUser).LoadAsync();
        await _context.Entry(task).Collection(t => t.Labels).LoadAsync();

        return Ok(new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            DueDate = task.DueDate,
            WorkflowId = task.WorkflowId,
            WorkflowName = task.Workflow?.Name,
            CurrentStepId = task.CurrentStepId,
            CurrentStepName = task.CurrentStep?.Name,
            AssignedToUserId = task.AssignedToUserId,
            AssignedToUserName = task.AssignedToUser?.Username,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            Labels = task.Labels.Select(l => new LabelDto
            {
                Id = l.Id,
                Name = l.Name,
                Color = l.Color,
                CreatedAt = l.CreatedAt
            }).ToList()
        });
    }

    // Specialized endpoint for assigning tasks to users
    [HttpPost("{id}/assign")]
    public async Task<ActionResult<TaskDto>> AssignTask(int id, AssignTaskDto dto)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();

        if (dto.AssignedToUserId.HasValue)
        {
            var user = await _context.Users.FindAsync(dto.AssignedToUserId.Value);
            if (user == null)
                return BadRequest("User not found");
        }

        task.AssignedToUserId = dto.AssignedToUserId;
        task.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Reload related data
        await _context.Entry(task).Reference(t => t.Workflow).LoadAsync();
        await _context.Entry(task).Reference(t => t.CurrentStep).LoadAsync();
        await _context.Entry(task).Reference(t => t.AssignedToUser).LoadAsync();
        await _context.Entry(task).Collection(t => t.Labels).LoadAsync();

        return Ok(new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            DueDate = task.DueDate,
            WorkflowId = task.WorkflowId,
            WorkflowName = task.Workflow?.Name,
            CurrentStepId = task.CurrentStepId,
            CurrentStepName = task.CurrentStep?.Name,
            AssignedToUserId = task.AssignedToUserId,
            AssignedToUserName = task.AssignedToUser?.Username,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            Labels = task.Labels.Select(l => new LabelDto
            {
                Id = l.Id,
                Name = l.Name,
                Color = l.Color,
                CreatedAt = l.CreatedAt
            }).ToList()
        });
    }

    // Get task history
    [HttpGet("{id}/history")]
    public async Task<ActionResult<IEnumerable<TaskStatusHistoryDto>>> GetTaskHistory(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();

        var history = await _context.TaskStatusHistories
            .Include(h => h.FromStep)
            .Include(h => h.ToStep)
            .Include(h => h.ChangedByUser)
            .Where(h => h.TaskId == id)
            .OrderByDescending(h => h.ChangedAt)
            .ToListAsync();

        return Ok(history.Select(h => new TaskStatusHistoryDto
        {
            Id = h.Id,
            TaskId = h.TaskId,
            FromStepId = h.FromStepId,
            FromStepName = h.FromStep?.Name,
            ToStepId = h.ToStepId,
            ToStepName = h.ToStep?.Name,
            ChangedByUserId = h.ChangedByUserId,
            ChangedByUserName = h.ChangedByUser?.Username,
            Comment = h.Comment,
            ChangedAt = h.ChangedAt
        }));
    }
}
