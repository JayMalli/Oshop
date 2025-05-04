namespace WebAPI.Dto.products
{
    public class ProductDtoReq
    {
        public string CategoryId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public float ProductPrice { get; set; }
        public string ProductIMG { get; set; } = null!;
    }
}