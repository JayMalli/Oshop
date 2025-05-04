namespace WebAPI.Dto
{
    public class OrderDetailsDto
    {
        public string OrderId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string OrderAddress { get; set; } = string.Empty;
        public string OrderStatus { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
    }
}