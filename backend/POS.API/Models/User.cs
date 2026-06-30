using System.ComponentModel.DataAnnotations;

namespace POS.API.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required, MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string Role { get; set; } = "Buyer"; // Admin, Seller, Buyer

        public string? AvatarUrl { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Store? Store { get; set; }
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<SellerRequest> SellerRequests { get; set; } = new List<SellerRequest>();
    }
}
