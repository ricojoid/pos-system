using System.ComponentModel.DataAnnotations;

namespace POS.API.DTOs
{
    // ======================== AUTH ========================
    public class LoginDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = null!;
    }

    // ======================== USER ========================
    public class UserDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public StoreDto? Store { get; set; }
    }

    public class UpdateUserDto
    {
        public string? FullName { get; set; }
        public string? AvatarUrl { get; set; }
        public bool? IsActive { get; set; }
    }

    // ======================== STORE ========================
    public class StoreDto
    {
        public int Id { get; set; }
        public string StoreName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public bool IsApproved { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ProductCount { get; set; }
    }

    public class UpdateStoreDto
    {
        [MaxLength(100)]
        public string? StoreName { get; set; }
        [MaxLength(500)]
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
    }

    // ======================== CATEGORY ========================
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Icon { get; set; } = string.Empty;
        public int ProductCount { get; set; }
    }

    public class CreateCategoryDto
    {
        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(200)]
        public string? Description { get; set; }
        [MaxLength(50)]
        public string Icon { get; set; } = "📦";
    }

    // ======================== PRODUCT ========================
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int StoreId { get; set; }
        public string StoreName { get; set; } = string.Empty;
    }

    public class CreateProductDto
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(1000)]
        public string? Description { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public int Stock { get; set; }
        public string? ImageUrl { get; set; }
        [Required]
        public int CategoryId { get; set; }
    }

    public class UpdateProductDto
    {
        [MaxLength(150)]
        public string? Name { get; set; }
        [MaxLength(1000)]
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public int? Stock { get; set; }
        public string? ImageUrl { get; set; }
        public int? CategoryId { get; set; }
        public bool? IsActive { get; set; }
    }

    // ======================== ORDER ========================
    public class OrderDto
    {
        public int Id { get; set; }
        public int BuyerId { get; set; }
        public string BuyerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ShippingAddress { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ProductImage { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string StoreName { get; set; } = string.Empty;
    }

    public class CreateOrderDto
    {
        [Required]
        public string ShippingAddress { get; set; } = string.Empty;
        [Required]
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }

    public class CreateOrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateOrderStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }

    // ======================== SELLER REQUEST ========================
    public class SellerRequestDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string StoreName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? AdminNotes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
    }

    public class CreateSellerRequestDto
    {
        [Required, MaxLength(100)]
        public string StoreName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
    }

    public class ReviewSellerRequestDto
    {
        [Required]
        public string Status { get; set; } = string.Empty; // Approved or Rejected
        public string? AdminNotes { get; set; }
    }

    // ======================== DASHBOARD ========================
    public class DashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalSellers { get; set; }
        public int TotalProducts { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public int PendingSellerRequests { get; set; }
    }

    public class SellerDashboardDto
    {
        public int TotalProducts { get; set; }
        public int TotalOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public int PendingOrders { get; set; }
        public List<RevenueDataDto> RevenueChart { get; set; } = new();
    }

    public class RevenueDataDto
    {
        public string Period { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int Orders { get; set; }
    }

    // ======================== PAGINATION ========================
    public class PaginatedResponse<T>
    {
        public List<T> Data { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    }
}
