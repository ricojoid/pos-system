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
    [Authorize(Roles = "Seller")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _db;

        public DashboardController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("seller")]
        public async Task<ActionResult<SellerDashboardDto>> GetSellerDashboard()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var store = await _db.Stores.FirstOrDefaultAsync(s => s.UserId == userId);
            if (store == null) return BadRequest(new { message = "Toko tidak ditemukan" });

            var storeProducts = await _db.Products.Where(p => p.StoreId == store.Id).ToListAsync();
            var productIds = storeProducts.Select(p => p.Id).ToList();

            var storeOrders = await _db.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.OrderItems.Any(oi => productIds.Contains(oi.ProductId)))
                .ToListAsync();

            var completedOrders = storeOrders.Where(o => o.Status == "Completed").ToList();

            // Revenue chart - last 6 months
            var revenueChart = new List<RevenueDataDto>();
            for (int i = 5; i >= 0; i--)
            {
                var month = DateTime.UtcNow.AddMonths(-i);
                var monthStart = new DateTime(month.Year, month.Month, 1);
                var monthEnd = monthStart.AddMonths(1);

                var monthOrders = completedOrders
                    .Where(o => o.CreatedAt >= monthStart && o.CreatedAt < monthEnd)
                    .ToList();

                var monthRevenue = monthOrders
                    .SelectMany(o => o.OrderItems.Where(oi => productIds.Contains(oi.ProductId)))
                    .Sum(oi => oi.Price * oi.Quantity);

                revenueChart.Add(new RevenueDataDto
                {
                    Period = month.ToString("MMM yyyy"),
                    Revenue = monthRevenue,
                    Orders = monthOrders.Count
                });
            }

            return Ok(new SellerDashboardDto
            {
                TotalProducts = storeProducts.Count,
                TotalOrders = storeOrders.Count,
                TotalRevenue = completedOrders
                    .SelectMany(o => o.OrderItems.Where(oi => productIds.Contains(oi.ProductId)))
                    .Sum(oi => oi.Price * oi.Quantity),
                PendingOrders = storeOrders.Count(o => o.Status == "Pending"),
                RevenueChart = revenueChart
            });
        }
    }
}
