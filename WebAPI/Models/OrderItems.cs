using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class OrderItems
    {
        [Required]
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(450)]
        public string OrderId { get; set; } = string.Empty;
        [ForeignKey("OrderId")]
        public Orders? Orders { get; set; }
        public string ProductId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public int? ProductQuantity { get; set; }
        public float? ProductPrice { get; set; }
        public byte[] ProductImage { get; set; } = null!;
    }
}