

namespace WebAPI.Dto.orders
{
    public class OrderResDto
    {
        public string UserId { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
        public string OrderAddress { get; set; } = string.Empty;
        public string OrderStatus { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        // public List<OrderItemsResDto> OrderItemsResDto { get; set; } = null!;
        public OrderItemsResDto OrderItemsResDto { get; set; } = null!;
    }
}