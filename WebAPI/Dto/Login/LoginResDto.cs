using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Dto
{
    public class LoginResDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string UserType { get; set; } = string.Empty;
        public string UserAddress { get; set; } = string.Empty;
        public string? Token { get; set; } = string.Empty;
    }
}