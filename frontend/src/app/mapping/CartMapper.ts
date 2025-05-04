import { BackendCartType } from '../types/BackendTypes';
import { FrontendCartType } from '../types/FrontendTypes';

export const CartMapper = (CartRes: BackendCartType) => {
  return {
    productId: CartRes.ProductId,
    title: CartRes.ProductName,
    category: CartRes.CategoryName,
    imgURL: CartRes.ProductImage,
    price: CartRes.ProductPrice,
    quantity: Number(CartRes.ProductQuantity),
  } as FrontendCartType;
};
