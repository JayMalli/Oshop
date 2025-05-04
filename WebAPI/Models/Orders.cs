using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Orders
    {
        [Key]
        [Required]
        public string OrderId { get; set; } = string.Empty;
        [Required]
        [MaxLength(450)]
        public string UserId { get; set; } = string.Empty;
        [ForeignKey("UserId")]
        public Order? Order { get; set; }
        public string OrderAddress { get; set; } = string.Empty;
        public string OrderStatus { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
    }
}