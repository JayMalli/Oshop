export type UserDetails = {
  userName: string;
  email: string;
  userType: string;
};

export type User = {
  userName: string;
  email: string;
  token: string | null;
  isAdmin: boolean;
};

export type Product = {
  title: string;
  price: string;
  category: string;
  imgURL: string;
  productId: string;
};

export type CartProduct = {
  productId: string;
  quantity: number;
};

export type CartProductsDetails = {
  title: string;
  price: string;
  category: string;
  imgURL: string;
  productId: string;
  quantity: number;
};

export type newProduct = {
  title: string;
  price: string;
  category: string;
  imgURL: string;
};

export type AddressDetails = {
  name: string;
  addline1: string;
  addline2: string;
  city: string;
};

export type Orders = {
  address: AddressDetails;
  productsData: CartProductsDetails[];
  totalAmount: number;
  status: string;
};
