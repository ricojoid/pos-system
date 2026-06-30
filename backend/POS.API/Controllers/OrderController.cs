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
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _db;

        public OrderController(AppDbContext db)
        {
            _db = db;
        }

        // Buyer: Create order (checkout)
        [HttpPost]
        public async Task<ActionResult> CreateOrder(CreateOrderDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (dto.Items == null || !dto.Items.Any())
                return BadRequest(new { message = "Keranjang kosong" });

            decimal totalAmount = 0;
            var orderItems = new List<Models.OrderItem>();

            foreach (var item in dto.Items)
            {
                var product = await _db.Products.FindAsync(item.ProductId);
                if (product == null)
                    return BadRequest(new { message = $"Produk dengan ID {item.ProductId} tidak ditemukan" });

                if (product.Stock < item.Quantity)
                    return BadRequest(new { message = $"Stok {product.Name} tidak mencukupi" });

                product.Stock -= item.Quantity;
                totalAmount += product.Price * item.Quantity;

                orderItems.Add(new Models.OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = product.Price
                });
            }

            var order = new Models.Order
            {
                BuyerId = userId,
                TotalAmount = totalAmount,
                ShippingAddress = dto.ShippingAddress,
                Status = "Pending",
                OrderItems = orderItems
            };

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Order berhasil dibuat", orderId = order.Id });
        }

        // Buyer: Get my orders
        [HttpGet("my-orders")]
        public async Task<ActionResult<List<OrderDto>>> GetMyOrders()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var orders = await _db.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.Store)
                .Where(o => o.BuyerId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    BuyerId = o.BuyerId,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    ShippingAddress = o.ShippingAddress,
                    CreatedAt = o.CreatedAt,
                    Items = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        ProductId = oi.ProductId,
                        ProductName = oi.Product.Name,
                        ProductImage = oi.Product.ImageUrl,
                        Quantity = oi.Quantity,
                        Price = oi.Price,
                        StoreName = oi.Product.Store.StoreName
                    }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        // Seller: Get orders for my store
        [HttpGet("seller-orders")]
        [Authorize(Roles = "Seller")]
        public async Task<ActionResult<List<OrderDto>>> GetSellerOrders()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var store = await _db.Stores.FirstOrDefaultAsync(s => s.UserId == userId);
            if (store == null) return BadRequest(new { message = "Toko tidak ditemukan" });

            var orders = await _db.Orders
                .Include(o => o.Buyer)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.OrderItems.Any(oi => oi.Product.StoreId == store.Id))
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    BuyerId = o.BuyerId,
                    BuyerName = o.Buyer.FullName,
                    TotalAmount = o.OrderItems
                        .Where(oi => oi.Product.StoreId == store.Id)
                        .Sum(oi => oi.Price * oi.Quantity),
                    Status = o.Status,
                    ShippingAddress = o.ShippingAddress,
                    CreatedAt = o.CreatedAt,
                    Items = o.OrderItems
                        .Where(oi => oi.Product.StoreId == store.Id)
                        .Select(oi => new OrderItemDto
                        {
                            Id = oi.Id,
                            ProductId = oi.ProductId,
                            ProductName = oi.Product.Name,
                            ProductImage = oi.Product.ImageUrl,
                            Quantity = oi.Quantity,
                            Price = oi.Price
                        }).ToList()
                })
                .ToListAsync();

            return Ok(orders);
        }

        // Seller: Update order status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Seller")]
        public async Task<ActionResult> UpdateOrderStatus(int id, UpdateOrderStatusDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var store = await _db.Stores.FirstOrDefaultAsync(s => s.UserId == userId);
            if (store == null) return BadRequest(new { message = "Toko tidak ditemukan" });

            var order = await _db.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id && o.OrderItems.Any(oi => oi.Product.StoreId == store.Id));

            if (order == null) return NotFound();

            var validStatuses = new[] { "Pending", "Processing", "Shipped", "Completed", "Cancelled" };
            if (!validStatuses.Contains(dto.Status))
                return BadRequest(new { message = "Status tidak valid" });

            order.Status = dto.Status;
            await _db.SaveChangesAsync();

            return Ok(new { message = $"Status order berhasil diubah menjadi {dto.Status}" });
        }

        // Buyer: Complete order
        [HttpPut("{id}/complete")]
        public async Task<ActionResult> CompleteOrder(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == id && o.BuyerId == userId);

            if (order == null) return NotFound(new { message = "Pesanan tidak ditemukan" });

            if (order.Status != "Shipped")
                return BadRequest(new { message = "Hanya pesanan yang sedang dikirim (Shipped) yang dapat diselesaikan" });

            order.Status = "Completed";
            await _db.SaveChangesAsync();

            return Ok(new { message = "Pesanan berhasil diselesaikan" });
        }
    }
}
