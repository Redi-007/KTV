using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KTV.API.Data;
using KTV.API.DTOs;
using KTV.API.Models;

namespace KTV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RolesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoleDto>>> GetRoles()
    {
        var roles = await _context.Roles.ToListAsync();
        return Ok(roles.Select(r => new RoleDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            CreatedAt = r.CreatedAt
        }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoleDto>> GetRole(int id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null)
            return NotFound();

        return Ok(new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            CreatedAt = role.CreatedAt
        });
    }

    [HttpPost]
    public async Task<ActionResult<RoleDto>> CreateRole(CreateRoleDto dto)
    {
        var role = new Role
        {
            Name = dto.Name,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRole), new { id = role.Id }, new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            CreatedAt = role.CreatedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRole(int id, UpdateRoleDto dto)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null)
            return NotFound();

        if (dto.Name != null)
            role.Name = dto.Name;
        if (dto.Description != null)
            role.Description = dto.Description;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null)
            return NotFound();

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
