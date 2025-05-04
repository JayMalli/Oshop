using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class CartItems
    {
        [Required]
        [Key]
        public int Id { get; set; }

        [Required]
        public string CartId { get; set; } = string.Empty;

        public Cart? Cart { get; set; }

        public string ProductId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public int? ProductQuantity { get; set; }
        public float? ProductPrice { get; set; }
        public byte[] ProductImage { get; set; } = null!;

    }
}