
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Order
    {
        [Key]
        [Required]
        [MaxLength(450)]
        public string UserId { get; set; } = string.Empty;
    }
}