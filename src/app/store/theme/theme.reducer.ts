import { createReducer, on } from '@ngrx/store';
import { toggleTheme, setTheme } from './theme.actions';
import { ThemeState, initialThemeState } from './theme.state';

export const themeReducer = createReducer(
  initialThemeState,
  on(toggleTheme, (state) => ({ ...state, isDarkTheme: !state.isDarkTheme })),
  on(setTheme, (state, { isDarkTheme }) => ({ ...state, isDarkTheme }))
);