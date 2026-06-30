using System.ComponentModel.DataAnnotations;

namespace POS.API.Models
{
    public class SellerRequest
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        [Required, MaxLength(100)]
        public string StoreName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required, MaxLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected

        public string? AdminNotes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ReviewedAt { get; set; }

        // Navigation
        public User User { get; set; } = null!;
    }
}
