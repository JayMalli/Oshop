using System.ComponentModel.DataAnnotations;

namespace WebAPI.Dto.orders
{
    public class UpdateOrderReqDto
    {
        [Required]
        public string UserId { get; set; } = string.Empty;
        [Required]
        public string OrderId { get; set; } = string.Empty;
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}