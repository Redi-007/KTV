using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KTV.API.Data;
using KTV.API.DTOs;
using KTV.API.Models;

namespace KTV.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _context.Users
            .Include(u => u.Institution)
            .Include(u => u.Roles)
            .ToListAsync();

        return Ok(users.Select(u => new UserDto
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            FirstName = u.FirstName,
            LastName = u.LastName,
            InstitutionId = u.InstitutionId,
            InstitutionName = u.Institution?.Name,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt,
            Roles = u.Roles.Select(r => r.Name).ToList()
        }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _context.Users
            .Include(u => u.Institution)
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound();

        return Ok(new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            InstitutionId = user.InstitutionId,
            InstitutionName = user.Institution?.Name,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            Roles = user.Roles.Select(r => r.Name).ToList()
        });
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto dto)
    {
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            InstitutionId = dto.InstitutionId,
            CreatedAt = DateTime.UtcNow
        };

        if (dto.RoleIds.Any())
        {
            var roles = await _context.Roles
                .Where(r => dto.RoleIds.Contains(r.Id))
                .ToListAsync();
            user.Roles = roles;
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        await _context.Entry(user).Reference(u => u.Institution).LoadAsync();

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            InstitutionId = user.InstitutionId,
            InstitutionName = user.Institution?.Name,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            Roles = user.Roles.Select(r => r.Name).ToList()
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
    {
        var user = await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound();

        if (dto.Username != null)
            user.Username = dto.Username;
        if (dto.Email != null)
            user.Email = dto.Email;
        if (dto.Password != null)
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        if (dto.FirstName != null)
            user.FirstName = dto.FirstName;
        if (dto.LastName != null)
            user.LastName = dto.LastName;
        if (dto.InstitutionId.HasValue)
            user.InstitutionId = dto.InstitutionId;

        if (dto.RoleIds != null)
        {
            user.Roles.Clear();
            var roles = await _context.Roles
                .Where(r => dto.RoleIds.Contains(r.Id))
                .ToListAsync();
            user.Roles = roles;
        }

        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
