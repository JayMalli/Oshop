using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Dto;
using WebAPI.Dto.orders;

namespace WebAPI.Interfaces
{
    public interface IOrderRepository
    {
        List<OrderResDto>? GetOrders(GetOrdersDtoReq getOrdersDtoReq);
        void AddOrder(OrderReqDto order);
        public UpdateOrderReqDto? UpdateOrder(UpdateOrderReqDto updateOrderReqDto);
    }
}