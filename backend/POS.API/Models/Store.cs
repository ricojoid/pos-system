using System.ComponentModel.DataAnnotations;

namespace POS.API.Models
{
    public class Store
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required, MaxLength(100)]
        public string StoreName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public string? LogoUrl { get; set; }

        public bool IsApproved { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User User { get; set; } = null!;
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
