import { BackendOrderItems, BackendOrders } from '../types/BackendTypes';
import { FrontendOrderItems, FrontendOrders } from '../types/FrontendTypes';

export const OrderReqMapper = (OrdersRes: FrontendOrders) => {
  const products = OrdersRes.products.map((pro) => {
    return {
      ProductId: pro.productId,
      ProductName: pro.title,
      ProductImage: pro.imgURL,
      CategoryName: pro.category,
      ProductPrice: +pro.price,
      ProductQuantity: pro.quantity,
    } as BackendOrderItems;
  });
  const data: BackendOrders = {
    OrderAddress: [
      OrdersRes.address.name,
      OrdersRes.address.addline1,
      OrdersRes.address.addline2,
      OrdersRes.address.city,
    ].join(','),
    OrderDate: OrdersRes.date,
    OrderStatus: OrdersRes.status,
    OrderItemsResDto: products,
  };
  return data;
};
