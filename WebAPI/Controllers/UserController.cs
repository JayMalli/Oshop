using System.Text.Json;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Dto;
using WebAPI.Helpers;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _configuration;

        private readonly IMapper _mapper;
        public UserController(IUnitOfWork uow, IConfiguration configuration, IMapper mapper)
        {
            _uow = uow;
            _configuration = configuration;
            _mapper = mapper;
        }
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginReqDto loginReq)
        {
            var user = await _uow.UserRepository.Authenticate(loginReq.UserEmail, loginReq.Password);

            if (user == null)
            {
                return StatusCode(401, "wrong email or password provided!");
            }
            var loginRes = new LoginResDto
            {
                Id = user.UserId,
                UserName = user.UserName,
                UserType = user.UserRole,
                UserEmail = user.UserEmail,
                Token = user.UserRole == "admin" ? CreateJWT(user) : null,
                UserAddress = user.Address
            };
            await _uow.SaveAsync();
            string json = JsonSerializer.Serialize(loginRes);
            return Ok(json);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Signup([FromBody] RegisterReqDto registerReqDto)
        {
            var user = _mapper.Map<User>(registerReqDto);
            user.UserId = Guid.NewGuid().ToString();
            var res = _uow.UserRepository.Register(user);
            if (res == null)
            {
                return StatusCode(406, "User is already exist");
            }
            var registerRes = new RegisterResDto
            {
                Id = user.UserId,
                UserName = user.UserName,
                Token = CreateJWT(user)
            };
            await _uow.SaveAsync();
            return Ok(registerRes);
        }
        private string CreateJWT(User user)
        {
            var Createjwt = new CreateJWT(_configuration);
            return Createjwt.CreateJWTToken(user);
        }

        [HttpPost("updateuser")]
        public async Task<IActionResult> UpdateUserDetails([FromBody] UserDetailsDto userDetailsDto)
        {
            var result = _uow.UserRepository.UpdateUserDetails(userDetailsDto);
            if (result == null)
            {
                return StatusCode(404, "User not found!");
            }
            await _uow.SaveAsync();

            return StatusCode(200, "User Details updated!");
        }


    }
}