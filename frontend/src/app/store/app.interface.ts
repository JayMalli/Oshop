import {
  FrontendCartType,
  FrontendProduct,
  FrontendUserType,
} from '../types/FrontendTypes';

export interface StoreInterface {
  products: FrontendProduct[];
  cartProducts: FrontendCartType[];
  user: FrontendUserType | null;
}
