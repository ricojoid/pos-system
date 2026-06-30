using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace POS.API.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int BuyerId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Required, MaxLength(30)]
        public string Status { get; set; } = "Pending"; // Pending, Processing, Shipped, Completed, Cancelled

        [MaxLength(500)]
        public string? ShippingAddress { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User Buyer { get; set; } = null!;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
