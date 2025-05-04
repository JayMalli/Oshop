import { createAction, props } from '@ngrx/store';
import { Product } from 'src/app/types';

export const products = createAction(
  '[productsModule] store the details of products',
  props<{ products: Product[] }>()
);
