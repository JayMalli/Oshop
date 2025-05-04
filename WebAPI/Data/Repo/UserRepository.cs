using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using WebAPI.Dto;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _dc;

        public UserRepository(DataContext dc)
        {
            _dc = dc;
        }

        public bool MatchPasswordHash(string passwordText, byte[] passwordHash, byte[] passwordKey)
        {
            using var hmac = new HMACSHA512(passwordKey);
            var password = hmac.ComputeHash(Encoding.UTF8.GetBytes(passwordText));
            Console.WriteLine("phash:" + Encoding.UTF8.GetString(passwordHash));
            Console.WriteLine("p:" + Encoding.UTF8.GetString(password));
            for (int i = 0; i < passwordHash.Length; i++)
            {
                if (password[i] != passwordHash[i])
                {
                    return false;
                }
            }
            return true;
        }

        public async Task<User?> Authenticate(string userEmail, string password)
        {
            var user = await _dc.Users.FirstOrDefaultAsync(u => u.UserEmail == userEmail && password == u.Password);
            // Console.WriteLine("user:" + user.UserEmail);
            if (user == null)
            {
                return null;
            }
            // if (!MatchPasswordHash(password, user.Password, user.PasswordKey))
            // {
            //     return null;
            // }
            return user;
        }

        public User? Register(User userReq)
        {
            var user = _dc.Users.SingleOrDefault(u => u.UserEmail == userReq.UserEmail);
            if (user == null)
            {
                _dc.Users.Add(entity: userReq);
                return userReq;
            }

            return null;
        }

        public async Task<User> GetUser(LoginReqDto loginReqDto)
        {
            return await _dc.Users.FirstAsync(u => u.UserEmail == loginReqDto.UserEmail);
        }

        public User? UpdateUserDetails(UserDetailsDto userDetailsDto)
        {
            var user = _dc.Users.FirstOrDefault(u => u.UserId == userDetailsDto.UserId);
            if (user == null)
            {
                return null;
            }
            user.Address = userDetailsDto.Address;
            return user;
        }
    }
}