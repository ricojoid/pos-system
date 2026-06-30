using POS.API.Models;

namespace POS.API.Data
{
    public static class SeedData
    {
        public static void Initialize(AppDbContext context)
        {
            context.Database.EnsureCreated();

            // Seed Admin
            if (!context.Users.Any(u => u.Role == "Admin"))
            {
                context.Users.Add(new User
                {
                    FullName = "System Admin",
                    Email = "admin@pos.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "Admin",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                });
                context.SaveChanges();
            }

            // Seed Categories
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new() { Name = "Elektronik", Description = "Perangkat elektronik dan gadget", Icon = "💻" },
                    new() { Name = "Fashion", Description = "Pakaian, sepatu, dan aksesoris", Icon = "👕" },
                    new() { Name = "Makanan & Minuman", Description = "Makanan ringan, minuman, dan bahan pokok", Icon = "🍔" },
                    new() { Name = "Kesehatan", Description = "Produk kesehatan dan kecantikan", Icon = "💊" },
                    new() { Name = "Rumah Tangga", Description = "Peralatan dan perlengkapan rumah tangga", Icon = "🏠" },
                    new() { Name = "Olahraga", Description = "Peralatan dan perlengkapan olahraga", Icon = "⚽" },
                    new() { Name = "Buku & Alat Tulis", Description = "Buku, alat tulis, dan perlengkapan kantor", Icon = "📚" },
                    new() { Name = "Otomotif", Description = "Aksesoris dan suku cadang kendaraan", Icon = "🚗" },
                };
                context.Categories.AddRange(categories);
                context.SaveChanges();
            }
        }
    }
}
