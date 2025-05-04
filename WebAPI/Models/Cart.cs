using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Cart
    {
        [Key]
        [Required]
        public string CartId { get; set; } = string.Empty;
        public string? Address { get; set; } = string.Empty;
    }
}