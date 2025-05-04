using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;

namespace WebAPI.Models
{
    public class Product
    {
        [Key]
        [Required]
        public string ProductId { get; set; } = string.Empty;
        [Required]
        public string CategoryId { get; set; } = string.Empty;

        public Category? Category { get; set; }

        [Required]
        public string ProductName { get; set; } = string.Empty;
        [Required]
        public float ProductPrice { get; set; }
        public byte[] ProductIMG { get; set; } = null!;
    }
}