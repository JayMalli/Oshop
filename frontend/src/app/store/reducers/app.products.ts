import { createReducer, on } from '@ngrx/store';
import { CartProduct, CartProductsDetails, Product, User } from 'src/app/types';
import { products } from '../actions/products';
import { cartProducts } from '../actions/cartProducts';
import { user } from '../actions/user';
import { FrontendUserType } from 'src/app/types/FrontendTypes';

export const initialState: {
  products: Product[];
  cartProducts: CartProduct[];
  cartProductsDetails: CartProductsDetails[];
  user: User | null;
} = {
  products: [],
  cartProducts: [],
  user: null,
  cartProductsDetails: [],
};

const mapCartProductsDetails = (prods: Product[], cartProds: CartProduct[]) => {
  let tempArr: CartProductsDetails[] = [];
  if (cartProds.length <= 0 || prods.length <= 0) {
    return tempArr;
  }

  cartProds.map((item) => {
    const idx = prods.findIndex((i) => i.productId === item.productId);
    if (idx >= 0) {
      const data = {
        title: prods[idx].title,
        imgURL: prods[idx].imgURL,
        category: prods[idx].category,
        price: prods[idx].price,
        productId: prods[idx].productId,
        quantity: item.quantity,
      };
      tempArr.push(data);
    }
  });

  return tempArr;
};

export const productsReducer = createReducer(
  initialState,
  // getting products
  on(products, (state, action) => ({ ...state, products: action.products })),
  // getting cart products
  on(cartProducts, (state, action) => {
    // for empty cart
    if (action.cartProducts.length === 0) {
      return {
        ...state,
        cartProducts: action.cartProducts,
        cartProductsDetails: [],
      };
    }

    // to get the all details of cart products in store
    const cartProDetails = mapCartProductsDetails(
      state.products,
      action.cartProducts
    );

    return {
      ...state,
      cartProducts: action.cartProducts,
      cartProductsDetails: cartProDetails,
    };
  }),
  // getting user details
  on(user, (state, action) => {
    if (action.user) {
      const ac = action.user;
      const data = {
        userID: ac.userID,
        email: ac.email,
        userName: ac.userName,
        isAdmin: ac.isAdmin,
        token: ac.token,
      } as FrontendUserType;
      return { ...state, user: data };
    }
    return { ...state, user: null };
  })
);
