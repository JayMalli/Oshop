using System.Text;
using WebAPI.Dto.orders;
using WebAPI.Interfaces;
using WebAPI.Models;

namespace WebAPI.Data.Repo
{
    public class OrderRepository : IOrderRepository
    {
        private readonly DataContext _dc;


        public OrderRepository(DataContext dc)
        {
            _dc = dc;
        }

        public List<OrderResDto>? GetOrders(GetOrdersDtoReq getOrdersDtoReq)
        {

            var query = from userOrder in _dc.Order join orders in _dc.Orders on userOrder.UserId equals orders.UserId join orderItems in _dc.OrderItems on orders.OrderId equals orderItems.OrderId select new { userOrder.UserId, orders.OrderId, orders.OrderAddress, orders.OrderDate, orders.OrderStatus, orderItems };

            var result = query.Select(s => new OrderResDto
            {
                UserId = s.UserId,
                OrderId = s.OrderId,
                OrderAddress = s.OrderAddress,
                OrderDate = s.OrderDate,
                OrderStatus = s.OrderStatus,
                OrderItemsResDto = new OrderItemsResDto
                {
                    CategoryName = s.orderItems.CategoryName,
                    ProductId = s.orderItems.ProductId,
                    ProductName = s.orderItems.ProductName,
                    ProductPrice = s.orderItems.ProductPrice,
                    ProductQuantity = s.orderItems.ProductQuantity,
                    ProductImage = Encoding.UTF8.GetString(s.orderItems.ProductImage)
                },
            });

            return getOrdersDtoReq.UserIsAdmin ? result.ToList() : result.Where(u => u.UserId == getOrdersDtoReq.UserId).ToList();
        }

        public void AddOrder(OrderReqDto order)
        {
            var userOrder = _dc.Order.Find(order.UserId);
            var currentUser = _dc.Users.FirstOrDefault(u => u.UserId == order.UserId);
            var OrderId = Guid.NewGuid().ToString();
            var OrderDate = DateTime.ParseExact(order.OrderDate, @"yyyy-MM-dd\THH:mm:ss.fff\Z", System.Globalization.CultureInfo.InvariantCulture);
            const string OrderStatus = "IN PROGRESS";
            var user = new Order { UserId = order.UserId };
            var orderDetails =

            new Orders
            {
                OrderAddress = order.OrderAddress,
                OrderDate = OrderDate,
                UserId = order.UserId,
                OrderId = OrderId,
                OrderStatus = OrderStatus,
            };
            // for first order
            if (userOrder == null)
            {
                _dc.Order.Add(user);
            }
            if (currentUser != null)
            {
                currentUser.Address = order.OrderAddress;
            }
            _dc.Orders.Add(entity: orderDetails);
            _dc.OrderItems.AddRange(
                order.OrderItemsReqDtos.Select(o => new OrderItems
                {
                    CategoryName = o.CategoryName,
                    OrderId = OrderId,
                    ProductId = o.ProductId,
                    ProductImage = Encoding.UTF8.GetBytes(o.ProductImage),
                    ProductPrice = o.ProductPrice,
                    ProductQuantity = o.ProductQuantity,
                    ProductName = o.ProductName,
                })
            );
        }

        public UpdateOrderReqDto? UpdateOrder(UpdateOrderReqDto updateOrderReqDto)
        {
            var order = _dc.Orders.FirstOrDefault(o => o.OrderId == updateOrderReqDto.OrderId && o.UserId == updateOrderReqDto.UserId);
            if (order == null)
            {
                return null;
            }
            order.OrderStatus = updateOrderReqDto.Status;
            return updateOrderReqDto;
        }

    }
}