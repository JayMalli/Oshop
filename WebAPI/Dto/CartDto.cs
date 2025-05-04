
namespace WebAPI.Dto
{
    public class CartDto
    {
        public string CartId { get; set; } = string.Empty;
        public string? ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public int? ProductQuantity { get; set; }
        public float? ProductPrice { get; set; }
        public string ProductImage { get; set; } = string.Empty;
        public string? Address { get; set; } = string.Empty;
    }
}