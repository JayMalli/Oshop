
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Dto.orders
{
    public class OrderReqDto
    {
        [Required]
        public string UserId { get; set; } = string.Empty;
        public string OrderAddress { get; set; } = string.Empty;
        public string OrderDate { get; set; } = string.Empty;
        public OrderItemsReqDto[] OrderItemsReqDtos { get; set; } = null!;
    }
}