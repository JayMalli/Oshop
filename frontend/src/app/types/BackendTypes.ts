export type BackendProductType = {
  productId: string;
  categoryName: string;
  productName: string;
  productPrice: number;
  productIMG: string;
};

export type BackendCategoryType = {
  categoryName: string;
  categoryId: string;
};

export type BackendUserType = {
  Id: string;
  UserName: string;
  UserType: string;
  UserEmail: string;
  Token: string | null;
};

export type BackendCartType = {
  ProductId: string;
  ProductQuantity: string;
  ProductPrice: string;
  ProductImage: string;
  ProductName: string;
  CategoryName: string;
  Address: string | null;
};

export type BackendOrderItems = {
  ProductId: string;
  ProductQuantity: number;
  ProductPrice: number;
  ProductImage: string;
  ProductName: string;
  CategoryName: string;
};

export type BackendOrders = {
  OrderAddress: string;
  OrderDate: string;
  OrderStatus: string;
  OrderId: string;
  UserId: string;
  OrderItemsResDto: BackendOrderItems;
};

export type BackendOrderss = {
  OrderAddress: string;
  OrderDate: string;
  OrderStatus: string;
  OrderId: string;
  UserId: string;
  OrderItemsResDto: BackendOrderItems[];
};
