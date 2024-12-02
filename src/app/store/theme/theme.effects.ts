import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { toggleTheme, setTheme } from './theme.actions';

@Injectable()
export class ThemeEffects {
  saveTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(toggleTheme, setTheme),
        tap(({ isDarkTheme }: any) => {
          localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}