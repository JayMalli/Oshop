import { BackendOrders, BackendOrderss } from '../types/BackendTypes';
import { FrontendOrderItems, FrontendOrders } from '../types/FrontendTypes';

const orderProducts = (OrdersRes: BackendOrders[]) => {
  let arr = [] as BackendOrderss[];
  OrdersRes.map((i) => {
    const isExist = arr.findIndex((item) => item.OrderId === i.OrderId);
    if (isExist >= 0) {
      arr[isExist].OrderItemsResDto.push(i.OrderItemsResDto);
      return arr[isExist];
    }
    let temp = [i.OrderItemsResDto];
    return arr.push({ ...i, OrderItemsResDto: temp });
  });
  return arr;
};

export const OrderMapper = (OrdersRes: BackendOrders[]) => {
  let details = orderProducts(OrdersRes);
  return details.map((order) => {
    const products = order.OrderItemsResDto.map((pro) => {
      return {
        title: pro.ProductName,
        productId: pro.ProductId,
        category: pro.CategoryName,
        imgURL: pro.ProductImage,
        price: `${pro.ProductPrice}`,
        quantity: pro.ProductQuantity,
      } as FrontendOrderItems;
    });
    const add = order.OrderAddress.split(',');
    const ord = {
      address: {
        name: add[0],
        addline1: add[1],
        addline2: add[2],
        city: add[3],
      },
      date: order.OrderDate,
      status: order.OrderStatus,
      orderId: order.OrderId,
      userId: order.UserId,
      products,
    } as FrontendOrders;
    return ord;
  });
};
