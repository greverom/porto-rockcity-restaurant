import { createReducer, on } from '@ngrx/store';
import { setAdminStatus, setLoggedInStatus, setUserData, unsetUserData } from './user.actions';
import { UserState } from './user.state';


export const initialUserState: UserState = {
  isAdmin: false,
  isLoggedIn: false,
  data: null
};

export const userReducer = createReducer(
  initialUserState,
  on(setAdminStatus, (state, { isAdmin }) => ({ ...state, isAdmin })),
  on(setLoggedInStatus, (state, { isLoggedIn }) => ({ ...state, isLoggedIn })),
  on(setUserData, (state, { data }) => ({ ...state, data })),
  on(unsetUserData, (state) => ({ ...state, data: null, isLoggedIn: false, isAdmin: false }))
);