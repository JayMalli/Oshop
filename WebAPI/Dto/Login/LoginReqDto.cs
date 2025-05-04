
namespace WebAPI.Dto
{
    public class LoginReqDto
    {
        public string UserEmail { get; set; } = string.Empty;
        public string Password { get; set; } = null!;
    }
}