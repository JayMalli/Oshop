import { createAction, props } from '@ngrx/store';
import { CartProduct } from 'src/app/types';
import { FrontendCartType } from 'src/app/types/FrontendTypes';

export const cartProducts = createAction(
  '[cartProductsModule] store the details of products which are avaible in cart',
  props<{ cartProducts: FrontendCartType[] }>()
);
