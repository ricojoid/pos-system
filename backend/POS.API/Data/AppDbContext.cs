using Microsoft.EntityFrameworkCore;
using POS.API.Models;

namespace POS.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Store> Stores => Set<Store>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<SellerRequest> SellerRequests => Set<SellerRequest>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Role).HasDefaultValue("Buyer");
            });

            // Store - One to One with User
            modelBuilder.Entity<Store>(entity =>
            {
                entity.HasOne(s => s.User)
                    .WithOne(u => u.Store)
                    .HasForeignKey<Store>(s => s.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasOne(p => p.Store)
                    .WithMany(s => s.Products)
                    .HasForeignKey(p => p.StoreId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(p => p.Category)
                    .WithMany(c => c.Products)
                    .HasForeignKey(p => p.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Order
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasOne(o => o.Buyer)
                    .WithMany(u => u.Orders)
                    .HasForeignKey(o => o.BuyerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // OrderItem
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasOne(oi => oi.Order)
                    .WithMany(o => o.OrderItems)
                    .HasForeignKey(oi => oi.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(oi => oi.Product)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(oi => oi.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // SellerRequest
            modelBuilder.Entity<SellerRequest>(entity =>
            {
                entity.HasOne(sr => sr.User)
                    .WithMany(u => u.SellerRequests)
                    .HasForeignKey(sr => sr.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
