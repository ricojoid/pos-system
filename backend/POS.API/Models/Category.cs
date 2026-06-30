using System.ComponentModel.DataAnnotations;

namespace POS.API.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Description { get; set; }

        [MaxLength(50)]
        public string Icon { get; set; } = "📦";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
