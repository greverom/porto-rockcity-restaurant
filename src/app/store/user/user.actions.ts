import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user';

export const setAdminStatus = createAction(
  '[User] Set Admin Status',
  props<{ isAdmin: boolean }>()
);

export const setLoggedInStatus = createAction(
  '[User] Set Logged In Status',
  props<{ isLoggedIn: boolean }>()
);

export const setUserData = createAction(
  '[User] Set User Data',
  props<{ data: User | null }>() 
);

export const unsetUserData = createAction(
  '[User] Unset User Data'
);