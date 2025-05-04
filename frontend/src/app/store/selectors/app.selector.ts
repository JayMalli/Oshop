import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StoreInterface } from '../app.interface';

export const selectRootState =
  createFeatureSelector<StoreInterface>('productsReducer');

export const selectProducts = createSelector(
  selectRootState,
  (state: StoreInterface) => state.products
);

export const selectCartProducts = createSelector(
  selectRootState,
  (state: StoreInterface) => state.cartProducts
);

export const selectUser = createSelector(
  selectRootState,
  (state: StoreInterface) => state.user
);
