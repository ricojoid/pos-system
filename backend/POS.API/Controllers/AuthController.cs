using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POS.API.Data;
using POS.API.DTOs;
using POS.API.Services;

namespace POS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly AuthService _auth;

        public AuthController(AppDbContext db, AuthService auth)
        {
            _db = db;
            _auth = auth;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "Email sudah terdaftar" });

            var user = new Models.User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = _auth.HashPassword(dto.Password),
                Role = "Buyer"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var token = _auth.GenerateToken(user);
            return Ok(new AuthResponseDto
            {
                Token = token,
                User = MapUserDto(user)
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _db.Users
                .Include(u => u.Store)
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !_auth.VerifyPassword(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Email atau password salah" });

            if (!user.IsActive)
                return Unauthorized(new { message = "Akun Anda telah dinonaktifkan" });

            var token = _auth.GenerateToken(user);
            return Ok(new AuthResponseDto
            {
                Token = token,
                User = MapUserDto(user)
            });
        }

        private static UserDto MapUserDto(Models.User user) => new()
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            AvatarUrl = user.AvatarUrl,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            Store = user.Store != null ? new StoreDto
            {
                Id = user.Store.Id,
                StoreName = user.Store.StoreName,
                Description = user.Store.Description,
                LogoUrl = user.Store.LogoUrl,
                IsApproved = user.Store.IsApproved,
                CreatedAt = user.Store.CreatedAt
            } : null
        };
    }
}
