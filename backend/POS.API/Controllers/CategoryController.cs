using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.DTOs;

namespace POS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CategoryController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<List<CategoryDto>>> GetCategories()
        {
            var categories = await _db.Categories
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Icon = c.Icon,
                    ProductCount = c.Products.Count(p => p.IsActive)
                })
                .ToListAsync();

            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(int id)
        {
            var category = await _db.Categories
                .Where(c => c.Id == id)
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Icon = c.Icon,
                    ProductCount = c.Products.Count(p => p.IsActive)
                })
                .FirstOrDefaultAsync();

            if (category == null) return NotFound();
            return Ok(category);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto dto)
        {
            var category = new Models.Category
            {
                Name = dto.Name,
                Description = dto.Description,
                Icon = dto.Icon
            };

            _db.Categories.Add(category);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Icon = category.Icon,
                ProductCount = 0
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateCategory(int id, CreateCategoryDto dto)
        {
            var category = await _db.Categories.FindAsync(id);
            if (category == null) return NotFound();

            category.Name = dto.Name;
            category.Description = dto.Description;
            category.Icon = dto.Icon;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Kategori berhasil diupdate" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await _db.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
            if (category == null) return NotFound();
            if (category.Products.Any()) return BadRequest(new { message = "Kategori masih memiliki produk" });

            _db.Categories.Remove(category);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Kategori berhasil dihapus" });
        }
    }
}
