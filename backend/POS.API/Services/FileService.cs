namespace POS.API.Services
{
    public class FileService
    {
        private readonly IWebHostEnvironment _env;

        public FileService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveFileAsync(IFormFile file, string folder)
        {
            var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads", folder);
            Directory.CreateDirectory(uploadsFolder);

            var uniqueName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, uniqueName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/uploads/{folder}/{uniqueName}";
        }

        public void DeleteFile(string fileUrl)
        {
            if (string.IsNullOrEmpty(fileUrl)) return;

            var filePath = Path.Combine(_env.ContentRootPath, fileUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}
