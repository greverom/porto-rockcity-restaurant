import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ThemeState } from './theme.state';

export const selectThemeState = createFeatureSelector<ThemeState>('theme');

export const selectIsDarkTheme = createSelector(
  selectThemeState,
  (state: ThemeState) => state.isDarkTheme
);