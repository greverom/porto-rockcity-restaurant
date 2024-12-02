import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';


export const selectUserState = createFeatureSelector<UserState>('user');

export const selectIsAdmin = createSelector(
  selectUserState,
  (state) => state.isAdmin
);

export const selectIsLoggedIn = createSelector(
  selectUserState,
  (state) => state.isLoggedIn
);

export const selectUserData = createSelector(
  selectUserState,
  (state) => state.data
);