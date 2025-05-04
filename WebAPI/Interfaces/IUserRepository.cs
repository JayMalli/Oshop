using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Dto;
using WebAPI.Models;

namespace WebAPI.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> Authenticate(string userName, string password);

        Task<User> GetUser(LoginReqDto loginReq);
        User? Register(User userReq);

        User? UpdateUserDetails(UserDetailsDto userDetailsDto);
    }
}