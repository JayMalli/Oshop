
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Category
    {
        [Key]
        public string CategoryId { get; set; } = string.Empty;
        [Required]
        public string CategoryName { get; set; } = string.Empty;

    }
}