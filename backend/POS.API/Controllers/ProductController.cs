using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.DTOs;
using POS.API.Services;
using System.Security.Claims;

namespace POS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly FileService _fileService;

        public ProductController(AppDbContext db, FileService fileService)
        {
            _db = db;
            _fileService = fileService;
        }

        // Public: Browse products
        [HttpGet]
        public async Task<ActionResult<PaginatedResponse<ProductDto>>> GetProducts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12,
            [FromQuery] string? search = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] string? sortBy = null)
        {
            var query = _db.Products
                .Include(p => p.Store)
                .Include(p => p.Category)
                .Where(p => p.IsActive && p.Store.IsApproved);

            if (!string.IsNullOrEmpty(search))
                query = query.Where(p => p.Name.Contains(search) || (p.Description != null && p.Description.Contains(search)));

            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryId == categoryId.Value);

            query = sortBy switch
            {
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                "newest" => query.OrderByDescending(p => p.CreatedAt),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var total = await query.CountAsync();
            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    StoreId = p.StoreId,
                    StoreName = p.Store.StoreName
                })
                .ToListAsync();

            return Ok(new PaginatedResponse<ProductDto>
            {
                Data = products,
                TotalCount = total,
                Page = page,
                PageSize = pageSize
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _db.Products
                .Include(p => p.Store)
                .Include(p => p.Category)
                .Where(p => p.Id == id)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    StoreId = p.StoreId,
                    StoreName = p.Store.StoreName
                })
                .FirstOrDefaultAsync();

            if (product == null) return NotFound();
            return Ok(product);
        }

        // Seller: CRUD own products
        [HttpGet("my-products")]
        [Authorize(Roles = "Seller")]
        public async Task<ActionResult<List<ProductDto>>> GetMyProducts()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var store = await _db.Stores.FirstOrDefaultAsync(s => s.UserId == userId);
            if (store == null) return BadRequest(new { message = "Anda belum memiliki toko" });

            var products = await _db.Products
                .Include(p => p.Category)
                .Where(p => p.StoreId == store.Id)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    StoreId = p.StoreId,
                    StoreName = store.StoreName
                })
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(products);
        }

        [HttpPost]
        [Authorize(Roles = "Seller")]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var store = await _db.Stores.FirstOrDefaultAsync(s => s.UserId == userId);
            if (store == null) return BadRequest(new { message = "Anda belum memiliki toko" });

            var product = new Models.Product
            {
                StoreId = store.Id,
                CategoryId = dto.CategoryId,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                ImageUrl = dto.ImageUrl
            };

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Produk berhasil ditambahkan", productId = product.Id });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Seller")]
        public async Task<ActionResult> UpdateProduct(int id, UpdateProductDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var store = await _db.Stores.FirstOrDefaultAsync(s => s.UserId == userId);
            if (store == null) return BadRequest(new { message = "Anda belum memiliki toko" });

            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id && p.StoreId == store.Id);
            if (product == null) return NotFound();

            if (dto.Name != null) product.Name = dto.Name;
            if (dto.Description != null) product.Description = dto.Description;
            if (dto.Price.HasValue) product.Price = dto.Price.Value;
            if (dto.Stock.HasValue) product.Stock = dto.Stock.Value;
            if (dto.ImageUrl != null) product.ImageUrl = dto.ImageUrl;
            if (dto.CategoryId.HasValue) product.CategoryId = dto.CategoryId.Value;
            if (dto.IsActive.HasValue) product.IsActive = dto.IsActive.Value;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Produk berhasil diupdate" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Seller")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var store = await _db.Stores.FirstOrDefaultAsync(s => s.UserId == userId);
            if (store == null) return BadRequest(new { message = "Anda belum memiliki toko" });

            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id && p.StoreId == store.Id);
            if (product == null) return NotFound();

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Produk berhasil dihapus" });
        }

        // Upload image
        [HttpPost("upload")]
        [Authorize(Roles = "Seller")]
        public async Task<ActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "File tidak valid" });

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var ext = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(ext))
                return BadRequest(new { message = "Format file tidak didukung" });

            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "Ukuran file maksimal 5MB" });

            var url = await _fileService.SaveFileAsync(file, "products");
            return Ok(new { url });
        }
    }
}
