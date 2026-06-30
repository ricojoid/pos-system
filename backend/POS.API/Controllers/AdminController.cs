using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.DTOs;
using POS.API.Models;
using System.Security.Claims;

namespace POS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AdminController(AppDbContext db)
        {
            _db = db;
        }

        // ===================== USER MANAGEMENT =====================

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PaginatedResponse<UserDto>>> GetUsers(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] string? role = null)
        {
            var query = _db.Users.Include(u => u.Store).AsQueryable();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(u => u.FullName.Contains(search) || u.Email.Contains(search));

            if (!string.IsNullOrEmpty(role))
                query = query.Where(u => u.Role == role);

            var total = await query.CountAsync();
            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Role = u.Role,
                    AvatarUrl = u.AvatarUrl,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    Store = u.Store != null ? new StoreDto
                    {
                        Id = u.Store.Id,
                        StoreName = u.Store.StoreName,
                        IsApproved = u.Store.IsApproved
                    } : null
                })
                .ToListAsync();

            return Ok(new PaginatedResponse<UserDto>
            {
                Data = users,
                TotalCount = total,
                Page = page,
                PageSize = pageSize
            });
        }

        [HttpPut("users/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateUser(int id, UpdateUserDto dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();

            if (dto.FullName != null) user.FullName = dto.FullName;
            if (dto.AvatarUrl != null) user.AvatarUrl = dto.AvatarUrl;
            if (dto.IsActive.HasValue) user.IsActive = dto.IsActive.Value;

            await _db.SaveChangesAsync();
            return Ok(new { message = "User berhasil diupdate" });
        }

        [HttpDelete("users/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound();
            if (user.Role == "Admin") return BadRequest(new { message = "Tidak bisa menghapus admin" });

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return Ok(new { message = "User berhasil dihapus" });
        }

        // ===================== SELLER REQUEST MANAGEMENT =====================

        [HttpGet("seller-requests")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<SellerRequestDto>>> GetSellerRequests([FromQuery] string? status = null)
        {
            var query = _db.SellerRequests.Include(sr => sr.User).AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(sr => sr.Status == status);

            var requests = await query
                .OrderByDescending(sr => sr.CreatedAt)
                .Select(sr => new SellerRequestDto
                {
                    Id = sr.Id,
                    UserId = sr.UserId,
                    UserName = sr.User.FullName,
                    UserEmail = sr.User.Email,
                    StoreName = sr.StoreName,
                    Description = sr.Description,
                    Status = sr.Status,
                    AdminNotes = sr.AdminNotes,
                    CreatedAt = sr.CreatedAt,
                    ReviewedAt = sr.ReviewedAt
                })
                .ToListAsync();

            return Ok(requests);
        }

        [HttpPut("seller-requests/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> ReviewSellerRequest(int id, ReviewSellerRequestDto dto)
        {
            var request = await _db.SellerRequests
                .Include(sr => sr.User)
                .FirstOrDefaultAsync(sr => sr.Id == id);

            if (request == null) return NotFound();
            if (request.Status != "Pending") return BadRequest(new { message = "Request sudah diproses" });

            request.Status = dto.Status;
            request.AdminNotes = dto.AdminNotes;
            request.ReviewedAt = DateTime.UtcNow;

            if (dto.Status == "Approved")
            {
                // Update user role to Seller
                request.User.Role = "Seller";

                // Create store
                var store = new Store
                {
                    UserId = request.UserId,
                    StoreName = request.StoreName,
                    Description = request.Description,
                    IsApproved = true
                };
                _db.Stores.Add(store);
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = $"Request berhasil {dto.Status.ToLower()}" });
        }

        // ===================== DASHBOARD STATS =====================

        [HttpGet("dashboard")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
        {
            var stats = new DashboardStatsDto
            {
                TotalUsers = await _db.Users.CountAsync(),
                TotalSellers = await _db.Users.CountAsync(u => u.Role == "Seller"),
                TotalProducts = await _db.Products.CountAsync(),
                TotalOrders = await _db.Orders.CountAsync(),
                TotalRevenue = await _db.Orders.Where(o => o.Status == "Completed").SumAsync(o => o.TotalAmount),
                PendingSellerRequests = await _db.SellerRequests.CountAsync(sr => sr.Status == "Pending")
            };

            return Ok(stats);
        }
    }
}
