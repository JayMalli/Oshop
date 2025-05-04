
namespace WebAPI.Dto.orders
{
    public class OrderItemsResDto
    {
        public string ProductId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public int? ProductQuantity { get; set; }
        public float? ProductPrice { get; set; }
        public string ProductImage { get; set; } = null!;
    }
}