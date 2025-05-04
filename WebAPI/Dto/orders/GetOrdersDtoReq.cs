namespace WebAPI.Dto.orders
{
    public class GetOrdersDtoReq
    {
        public string UserId { get; set; } = string.Empty;
        public bool UserIsAdmin { get; set; }
    }
}