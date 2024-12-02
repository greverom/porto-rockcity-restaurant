import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { setAdminStatus } from './user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions) {}

  logAdminStatus$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setAdminStatus),
        tap(action => console.log('El estado de administrador cambió:', action.isAdmin))
      ),
    { dispatch: false } 
  );
}