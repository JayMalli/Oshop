using System.ComponentModel.DataAnnotations;
namespace WebAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string UserId { get; set; } = string.Empty;
        [Required]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public string UserEmail { get; set; } = string.Empty;
        [Required]
        [MinLength(4)]
        public string Password { get; set; } = null!;
        // public byte[] PasswordKey { get; set; } = null!;
        [Required]
        public string UserRole { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }
}