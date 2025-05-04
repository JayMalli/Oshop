import { BackendProductType } from '../types/BackendTypes';

export const ProductMapper = (ProductRes: BackendProductType) => {
  return {
    title: ProductRes.productName,
    price: `${ProductRes.productPrice}`,
    category: ProductRes.categoryName,
    imgURL: ProductRes.productIMG,
    productId: ProductRes.productId,
  };
};
