export type FrontendCategoryType = {
  id: string;
  name: string;
};

export type FrontendUserType = {
  userID: string;
  userName: string;
  email: string;
  token: string | null;
  isAdmin: boolean;
  userAddress: string;
};

export type FrontendCartType = {
  title: string;
  price: string;
  category: string;
  imgURL: string;
  productId: string;
  quantity: number;
};

export type FrontendAddressDetails = {
  name: string;
  addline1: string;
  addline2: string;
  city: string;
};

export type FrontendOrderItems = {
  title: string;
  price: string;
  category: string;
  imgURL: string;
  productId: string;
  quantity: number;
};

export type FrontendOrders = {
  address: FrontendAddressDetails;
  status: string;
  date: string;
  orderId: string;
  userId: string;
  products: FrontendOrderItems[];
};

export type Orders = {
  orderId: string;
  status: string;
  address: FrontendAddressDetails;
  date: string;
  totalAmount: number;
  products: FrontendOrderItems[];
};

export type FrontendAdminOrders = {
  userId: string;
  orders: Orders[];
};

export type FrontendUserOrders = {
  status: string;
  address: FrontendAddressDetails;
  date: string;
  totalAmount: number;
  products: FrontendOrderItems[];
};

export type FrontendProduct = {
  title: string;
  price: string;
  category: string;
  imgURL: string;
  productId: string;
};

export type FrontendNewProduct = {
  title: string;
  price: string;
  category: string;
  imgURL: string;
};
