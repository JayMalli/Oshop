using System.Text;
using System.Text.Json;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Dto;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/cart")]

    public class CartControlller : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        public CartControlller(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }
        [HttpPost("addcart")]
        public async Task<IActionResult> UpdateCart(CartDto cartDtoReq)
        {
            var carts = _uow.CartRepository.GetCart(cartDtoReq.CartId);
            var cart = carts.Find(c => c.CartId == cartDtoReq.CartId);
            // add item to cart for first time
            var cartItem = _mapper.Map<CartItems>(cartDtoReq);
            cartItem.ProductImage = Encoding.UTF8.GetBytes(cartDtoReq.ProductImage);
            if (cart == null)
            {
                _uow.CartRepository.AddCart(cartItem);
            }
            else
            {
                _uow.CartRepository.UpdateCart(cartItem);
            }
            await _uow.SaveAsync();
            string json = JsonSerializer.Serialize(StatusCode(200, "Cart is Updated!"));
            return Ok(json);
        }
        [HttpGet("getcart/{cartId}")]
        public IActionResult GetCart(string cartId)
        {
            if (string.IsNullOrEmpty(cartId))
            {
                return StatusCode(404, "Provide valid cart id");
            }
            var carts = _uow.CartRepository.GetCart(cartId);
            var cartsDto = _mapper.Map<List<CartDto>>(carts);
            string json = JsonSerializer.Serialize(cartsDto);
            return Ok(json);
        }

        [HttpPost("clearcart")]
        public async Task<IActionResult> ClearCart([FromBody] string cartId)
        {
            if (string.IsNullOrEmpty(cartId))
            {
                return StatusCode(404, "Provide valid cart id");
            }
            _uow.CartRepository.ClearCart(cartId);
            await _uow.SaveAsync();
            return StatusCode(200, "Cart is Cleared!");
        }
    }
}