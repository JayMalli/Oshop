
namespace WebAPI.Dto.products
{
    public class ProductDtoRes
    {
        public string ProductId { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public float ProductPrice { get; set; }
        public string ProductIMG { get; set; } = null!;

    }
}