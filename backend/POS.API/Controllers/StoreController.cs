using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.DTOs;
using System.Security.Claims;

namespace POS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StoreController : ControllerBase
    {
        private readonly AppDbContext _db;

        public StoreController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("my-store")]
        [Authorize(Roles = "Seller")]
        public async Task<ActionResult<StoreDto>> GetMyStore()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var store = await _db.Stores
                .Include(s => s.Products)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (store == null) return NotFound(new { message = "Anda belum memiliki toko" });

            return Ok(new StoreDto
            {
                Id = store.Id,
                StoreName = store.StoreName,
                Description = store.Description,
                LogoUrl = store.LogoUrl,
                IsApproved = store.IsApproved,
                CreatedAt = store.CreatedAt,
                ProductCount = store.Products.Count
            });
        }

        [HttpPut("my-store")]
        [Authorize(Roles = "Seller")]
        public async Task<ActionResult> UpdateMyStore(UpdateStoreDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var store = await _db.Stores.FirstOrDefaultAsync(s => s.UserId == userId);
            if (store == null) return NotFound();

            if (dto.StoreName != null) store.StoreName = dto.StoreName;
            if (dto.Description != null) store.Description = dto.Description;
            if (dto.LogoUrl != null) store.LogoUrl = dto.LogoUrl;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Toko berhasil diupdate" });
        }

        // Seller request to become seller
        [HttpPost("request")]
        [Authorize(Roles = "Buyer")]
        public async Task<ActionResult> RequestSeller(CreateSellerRequestDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Check existing pending request
            var existingRequest = await _db.SellerRequests
                .FirstOrDefaultAsync(sr => sr.UserId == userId && sr.Status == "Pending");

            if (existingRequest != null)
                return BadRequest(new { message = "Anda sudah memiliki request yang sedang diproses" });

            var request = new Models.SellerRequest
            {
                UserId = userId,
                StoreName = dto.StoreName,
                Description = dto.Description
            };

            _db.SellerRequests.Add(request);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Request berhasil dikirim, menunggu persetujuan admin" });
        }

        [HttpGet("my-requests")]
        [Authorize]
        public async Task<ActionResult<List<SellerRequestDto>>> GetMyRequests()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var requests = await _db.SellerRequests
                .Where(sr => sr.UserId == userId)
                .OrderByDescending(sr => sr.CreatedAt)
                .Select(sr => new SellerRequestDto
                {
                    Id = sr.Id,
                    UserId = sr.UserId,
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
    }
}
