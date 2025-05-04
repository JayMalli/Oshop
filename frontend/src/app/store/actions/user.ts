import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/types';
import { FrontendUserType } from 'src/app/types/FrontendTypes';

export const user = createAction(
  '[userModule] store the user details',
  props<{ user: FrontendUserType | null }>()
);
