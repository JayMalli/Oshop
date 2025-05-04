using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Dto.orders;
using WebAPI.Interfaces;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/order")]
    public class OrderController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        public OrderController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpPost("getorders")]
        public async Task<IActionResult> GetOrders([FromBody] GetOrdersDtoReq getOrdersDtoReq)
        {
            var result = _uow.OrderRepository.GetOrders(getOrdersDtoReq);
            string json = JsonSerializer.Serialize(result);
            await _uow.SaveAsync();
            return Ok(json);
        }
        [HttpPost("addorder")]
        public async Task<IActionResult> AddOrder([FromBody] OrderReqDto orderReqDto)
        {
            _uow.OrderRepository.AddOrder(orderReqDto);
            string json = JsonSerializer.Serialize(new { status = 200, message = "order added!" });
            await _uow.SaveAsync();
            return Ok(StatusCode(200, json));
        }
        [HttpPut("updateorder")]

        public async Task<IActionResult> UpdateOrder([FromBody] UpdateOrderReqDto updateOrderReqDto)
        {
            var result = _uow.OrderRepository.UpdateOrder(updateOrderReqDto);
            if (result == null)
            {
                string json = JsonSerializer.Serialize(StatusCode(404, "order is not found!"));
                return Ok(json);
            }
            await _uow.SaveAsync();
            string json2 = JsonSerializer.Serialize(StatusCode(200, "order status updated!"));
            return Ok(json2);
        }
    }
}